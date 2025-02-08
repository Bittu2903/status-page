import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { getServices, Service } from '../services/api';
import { LoadingSpinner } from '../components/Shared/LoadingSpinner';

export default function PublicStatusPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded performance':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial outage':
        return 'bg-orange-100 text-orange-800';
      case 'major outage':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Activity className="h-12 w-12 text-indigo-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            System Status
          </h1>
          <p className="mt-2 text-gray-600">
            Current status of our services and systems
          </p>
        </div>

        {error ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {services.map((service) => (
                <li key={service.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          {service.name}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.current_status)}`}>
                          {service.current_status}
                        </span>
                      </div>
                    </div>
                    {service.description && (
                      <div className="mt-2 text-sm text-gray-500">
                        {service.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}