export interface Service {
  id: string;
  name: string;
  description?: string;
  current_status: string; 
  org_id: string;
  created_at: string;
}
  
  export interface Incident {
    id: string;
    description: string;
    status: string;
    service_id: string; 
    created_at?: string;
    updated_at?: string; 
  }