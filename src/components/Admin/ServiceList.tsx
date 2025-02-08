import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Service } from "../../types";
import { LoadingSpinner } from "../Shared/LoadingSpinner";
import { deleteService } from "../../services/api";

interface ServiceListProps {
  services: Service[];
  onUpdateServiceStatus: (id: string, status: string) => void;
  fetchServices: () => void;
}

export function ServiceList({
  services,
  onUpdateServiceStatus,
  fetchServices,
}: ServiceListProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchServices();
  }, []);
  const handleUpdateStatus = async (id: string, status: string) => {
    setLoading(true);
    await onUpdateServiceStatus(id, status);
    setLoading(false);
  };

  const handleDeleteService = async (id: string) => {
    setLoading(true);
    await deleteService(id);
    await fetchServices();
    setLoading(false);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="service-list-container">
      <table className="service-list min-w-full bg-white shadow-md rounded overflow-hidden">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="text-left p-3 px-5">Name</th>
            <th className="text-left p-3 px-5">Status</th>
            <th className="text-left p-3 px-5">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-t hover:bg-gray-100">
              <td className="p-3 px-5">{service.name}</td>
              <td className="p-3 px-5">{service.current_status}</td>
              <td className="p-3 px-5 space-x-2">
                <Button
                  className="py-1 px-3 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={() => handleUpdateStatus(service.id, "Operational")}
                  disabled={loading}
                >
                  Operational
                </Button>
                <Button
                  className="py-1 px-3 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                  onClick={() =>
                    handleUpdateStatus(service.id, "Degraded Performance")
                  }
                  disabled={loading}
                >
                  Degraded
                </Button>
                <Button
                  className="py-1 px-3 bg-orange-500 text-white rounded hover:bg-orange-700"
                  onClick={() =>
                    handleUpdateStatus(service.id, "Partial Outage")
                  }
                  disabled={loading}
                >
                  Partial Outage
                </Button>
                <Button
                  className="py-1 px-3 bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={() => handleUpdateStatus(service.id, "Major Outage")}
                  disabled={loading}
                >
                  Major Outage
                </Button>
                <Button
                  className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDeleteService(service.id)}
                  disabled={loading}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
