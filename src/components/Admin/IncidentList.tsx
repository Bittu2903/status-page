import { useEffect, useState } from "react";
import { deleteIncident, getIncidents } from "../../services/api";
import { LoadingSpinner } from "../Shared/LoadingSpinner";
import { ErrorMessage } from "../Shared/ErrorMessage";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IncidentListProps {
  serviceId: string;
  refreshKey: number;
}

export function IncidentList({ serviceId, refreshKey }: IncidentListProps) {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const result = await getIncidents(serviceId);
      setIncidents(result);
    } catch (err) {
      console.error("Failed to fetch incidents:", err);
      setError('Failed to fetch incidents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serviceId) {
      fetchIncidents();
    }
  }, [serviceId, refreshKey]);

  const handleDeleteIncident = async (id: string) => {
    setLoading(true);
    try {
      await deleteIncident(id);
      fetchIncidents();
    } catch (err) {
      console.error("Failed to delete incident:", err);
      setError('Failed to delete incident');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto mt-4">
      {incidents.map((incident) => (
        <Card key={incident.id} className="p-4 shadow-md">
          <h3 className="text-lg font-medium">{incident.title}</h3>
          <p className="text-sm text-gray-500 mt-2">{incident.description}</p>
          <div className="mt-3 text-sm flex justify-between items-center">
            <span className="text-gray-400">
              {format(new Date(incident.created_at), "PPpp")}
            </span>
            <Badge
              variant={incident.status === "resolved" ? "success" : "warning"}
            >
              {incident.status}
            </Badge>
            <Button
              className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => handleDeleteIncident(incident.id)}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}