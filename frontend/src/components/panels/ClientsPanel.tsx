'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';

export default function ClientsPanel() {
  const router = useRouter();
  const { clients, deleteClient } = useGenerator();

  const handleAddClient = () => {
    router.push('/clients/new');
  };

  const handleEditClient = (client: any) => {
    router.push(`/clients/${client.id}`);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      deleteClient(clientId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 -mx-8 -mt-8 px-8 py-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
              <p className="text-sm text-slate-600 mt-1">Gestiona todos tus clientes y sus configuraciones</p>
            </div>
          </div>
          <button
            onClick={handleAddClient}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Plus size={20} />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Clients Grid */}
      {clients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No hay clientes creados aún</p>
          <button
            onClick={handleAddClient}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Crear primer cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
            >
              {/* Client Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{client.business_type}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {client.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-2 mb-4 text-sm">
                {client.email && (
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span> {client.email}
                  </p>
                )}
                {client.target_audience && (
                  <p className="text-gray-600">
                    <span className="font-medium">Audiencia:</span> {client.target_audience}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditClient(client)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClient(client.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
