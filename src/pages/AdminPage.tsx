import { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Activity, LogOut } from "lucide-react";
import { Dashboard } from "../components/Admin/Dashboard";
import { ServiceList } from "../components/Admin/ServiceList";
import { IncidentList } from "../components/Admin/IncidentList";
import { supabase } from "../services/supabase";
import { Service } from "../types";
import ProtectedRoute from "../lib/ProtectedRoute";

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    } else {
      fetchServices();
    }
  }, [user, navigate]);

  const fetchServices = async () => {
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
      console.error("Error fetching services:", error);
    } else {
      setServices(data);
      if (data.length > 0) {
        setSelectedServiceId(data[0].id);
      }
    }
  };

  const updateServiceStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("services")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.error("Error updating service status:", error);
    } else {
      fetchServices();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Admin Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex space-x-8 py-4">
            <Link
              to="/admin"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/services"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Services
            </Link>
            <Link
              to="/admin/incidents"
              className="text-gray-900 hover:text-gray-700 px-3 py-2 text-sm font-medium"
            >
              Incidents
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute>
                <ServiceList
                  services={services}
                  fetchServices={fetchServices}
                  onUpdateServiceStatus={updateServiceStatus}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incidents"
            element={
              <ProtectedRoute>
                <IncidentList serviceId={selectedServiceId || ""} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
