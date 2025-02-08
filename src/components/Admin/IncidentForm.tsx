import React, { useState } from 'react';
import { createIncident, createIncidentUpdate } from '../../services/api';
import { ErrorMessage } from '../Shared/ErrorMessage';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IncidentFormProps {
  serviceId: string;
  onIncidentCreated: () => void;
}

export function IncidentForm({ serviceId, onIncidentCreated }: IncidentFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('investigating');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const incident = await createIncident({
        title,
        description,
        status,
        service_id: serviceId
      });

      await createIncidentUpdate({
        incident_id: incident.id,
        message: `Incident started: ${description}`,
        status
      });

      setTitle('');
      setDescription('');
      setStatus('investigating');
      onIncidentCreated();
    } catch (err) {
      setError('Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      {error && <ErrorMessage message={error} />}

      <div>
        <Label htmlFor="title" className="mb-1 text-gray-700 font-semibold">Incident Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          required
          variant="default"
          placeholder="Enter incident title"
          className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="description" className="mb-1 text-gray-700 font-semibold">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe the issue"
          className="w-full border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <Label htmlFor="status" className="mb-1 text-gray-700 font-semibold">Status</Label>
        <Select onValueChange={setStatus} value={status} className="w-full">
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status Options</SelectLabel>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="identified">Identified</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        loading={loading}
        variant="primary"
        size="lg"
        className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded shadow transition-all"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Incident'}
      </Button>
    </form>
  );
}