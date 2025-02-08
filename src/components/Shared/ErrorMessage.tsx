import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
      <AlertCircle className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
}