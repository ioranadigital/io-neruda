'use client';

import { useRouter, useParams } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import ClientProfileForm from '../forms/ClientProfileForm';
import { ArrowLeft } from 'lucide-react';

export default function ClientEditContent() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const { clients } = useGenerator();

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Cliente no encontrado</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-x-hidden">
      {/* Header con botón atrás */}
      <div className="flex-shrink-0 px-6 md:px-8 pt-6 pb-4 border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft size={20} />
          Volver a Clientes
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Editar Cliente</h1>
        <p className="text-sm text-gray-600 mt-2">{client.name}</p>
      </div>

      {/* Ficha de cliente - scrolleable full-width */}
      <div className="flex-1 min-h-0 overflow-auto w-full">
        <div className="w-full p-6 md:p-8">
          <ClientProfileForm client={client} />
        </div>
      </div>
    </div>
  );
}
