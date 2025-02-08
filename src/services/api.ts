import { supabase } from "./supabase";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  current_status: string;
  org_id: string;
  created_at: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string | null;
  status: string;
  service_id: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  message: string;
  status: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  org_id: string;
  role: string;
  created_at: string;
}

// Get user's organization
export const getUserOrganization = async (userId: string) => {
  const { data, error } = await supabase
    .from("team_members")
    .select("organizations(*)")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data.organizations;
};

// Services
export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Service[];
};

export const createService = async (service: Partial<Service>) => {
  const { data, error } = await supabase
    .from("services")
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data as Service;
};

export const updateService = async (id: string, updates: Partial<Service>) => {
  const { data, error } = await supabase
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Service;
};

// Services
export const deleteService = async (id: string) => {
  const { error } = await supabase.from("services").delete().eq("id", id);

  if (error) throw error;
  return true;
};

// Incidents
export const getIncidents = async (serviceId: string) => {
  const { data, error } = await supabase
    .from("incidents")
    .select("*, incident_updates(*)")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createIncident = async (incident: Partial<Incident>) => {
  const { data, error } = await supabase
    .from("incidents")
    .insert([incident])
    .select()
    .single();

  if (error) throw error;
  return data as Incident;
};

export const updateIncident = async (
  id: string,
  updates: Partial<Incident>
) => {
  const { data, error } = await supabase
    .from("incidents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Incident;
};

// Incident Updates
export const createIncidentUpdate = async (update: Partial<IncidentUpdate>) => {
  const { data, error } = await supabase
    .from("incident_updates")
    .insert([update])
    .select()
    .single();

  if (error) throw error;
  return data as IncidentUpdate;
};

// Incidents
export const deleteIncident = async (id: string) => {
  const { error } = await supabase.from("incidents").delete().eq("id", id);

  if (error) throw error;
  return true;
};
