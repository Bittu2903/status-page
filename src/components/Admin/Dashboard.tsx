import { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { ServiceForm } from "./ServiceForm";
import { ServiceList } from "./ServiceList";
import { IncidentForm } from "./IncidentForm";
import { IncidentList } from "./IncidentList";
import { Service} from "../../types";


export function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error fetching services:", error);
      setError("Failed to fetch services");
    } else {
      setServices(data);
      if (data.length > 0) {
        setSelectedServiceId(data[0].id);
      }
    }
  };

  const handleIncidentCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1); 
  };

  const addService = async (name: string, description: string, status?: string) => {
    const currentStatus = status || 'operational';
    
    const { error } = await supabase.from('services').insert([
      { name, description, current_status: currentStatus }
    ]);
    
    if (error) {
      console.error('Error adding service:', error);
      setError('Failed to add service');
    } else {
      fetchServices();
    }
  };

  const updateServiceStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('services').update({ current_status: status }).eq('id', id);
    if (error) {
      console.error('Error updating service status:', error);
      setError('Failed to update service status');
    } else {
      fetchServices();
    }
  };

  

  return (
    <div className="dashboard container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Service Management</h1>
      {error && (
        <p className="error text-red-500 bg-red-100 p-2 rounded">{error}</p>
      )}
      <ServiceForm onAddService={addService} />
      <ServiceList
        services={services}
        fetchServices={fetchServices}
        onUpdateServiceStatus={updateServiceStatus}
      />
      {selectedServiceId && (
        <div className="flex space-x-8 mt-8">
          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4 ml-8">Incident Form</h2>
            <IncidentForm serviceId={selectedServiceId} onIncidentCreated={handleIncidentCreated} />
          </div>

          <div className="w-1/2">
            <h2 className="text-xl font-bold mb-4 ml-8  ">Incident List</h2>
            <IncidentList serviceId={selectedServiceId} refreshKey={refreshKey} />
          </div>
        </div>
      )}
    </div>
  );
}