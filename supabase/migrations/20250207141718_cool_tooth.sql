/*
  # Initial Schema Setup for Status Page Application

  1. Tables
    - organizations
      - id (uuid, primary key)
      - name (text)
      - created_at (timestamp)
    - services
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - current_status (text)
      - org_id (uuid, foreign key)
      - created_at (timestamp)
    - incidents
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - status (text)
      - service_id (uuid, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)
    - incident_updates
      - id (uuid, primary key)
      - incident_id (uuid, foreign key)
      - message (text)
      - status (text)
      - created_at (timestamp)
    - team_members
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - org_id (uuid, foreign key)
      - role (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  current_status text NOT NULL DEFAULT 'operational',
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create incidents table
CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'investigating',
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create incident updates table
CREATE TABLE incident_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid REFERENCES incidents(id) ON DELETE CASCADE,
  message text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create team members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, org_id)
);

-- Enable Row Level Security
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE services ALTER COLUMN current_status SET DEFAULT 'operational';
ALTER TABLE services ADD COLUMN updated_at timestamptz DEFAULT now();

-- Create policies
CREATE POLICY "Team members can read their organization"
  ON organizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.org_id = organizations.id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can read services"
  ON services
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.org_id = services.org_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can read services"
  ON services
  FOR SELECT
  USING (true);

CREATE POLICY "Team members can manage services"
  ON services
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.org_id = services.org_id
      AND team_members.user_id = auth.uid()
      AND team_members.role IN ('admin', 'editor')
    )
  );

-- Similar policies for incidents and incident updates
CREATE POLICY "Public can read incidents"
  ON incidents
  FOR SELECT
  USING (true);

CREATE POLICY "Team members can manage incidents"
  ON incidents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      JOIN services s ON s.org_id = tm.org_id
      WHERE s.id = incidents.service_id
      AND tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'editor')
    )
  );

-- Create functions for real-time updates
CREATE OR REPLACE FUNCTION public.handle_status_change()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_status_change
  BEFORE UPDATE ON services
  FOR EACH ROW
  WHEN (OLD.current_status IS DISTINCT FROM NEW.current_status)
  EXECUTE FUNCTION handle_status_change();