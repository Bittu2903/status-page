import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ServiceFormProps {
  onAddService: (name: string, status: string) => void;
}

export function ServiceForm({ onAddService }: ServiceFormProps) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Operational');

  React.useEffect(() => {
    setStatus('operational');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddService(name, status);
    setName('');
    setStatus('Operational');
  };

  return (
    <form onSubmit={handleSubmit} className="service-form mb-4 flex space-x-2">
      <Input
        placeholder="Service Name"
        value={name}
        onChange={(e: any) => setName(e.target.value)}
        required
        className="p-2 border border-gray-300 rounded"
      />
      <Input
        placeholder="Service Status"
        value={status}
        onChange={(e: any) => setStatus(e.target.value)}
        required
        className="p-2 border border-gray-300 rounded"
      />
      <Button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Add Service
      </Button>
    </form>
  );
}