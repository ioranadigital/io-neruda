'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGenerator } from '@/src/context/GeneratorContext';
import { useClients } from '@/src/hooks/useClients';
import { showToast } from '@/src/components/shared/Toast';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import ClientModalForm from '@/src/components/shared/ClientModalForm';

export default function ClientsPage() {
  const { clients, isLoading } = useGenerator();
  const [showModal, setShowModal] = useState(false);
  const { createNewClient, deactivateClient } = useClients();

  const loadClients = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      showToast.success('✅ Clientes actualizados');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error cargando clientes';
      showToast.error(`❌ ${message}`);
    }
  };

  const handleCreateClient = async (input: any) => {
    try {
      await createNewClient(input);
      showToast.success('✅ Cliente creado exitosamente');
      setShowModal(false);
      await loadClients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creando cliente';
      showToast.error(`❌ ${message}`);
    }
  };

  const handleDeleteClient = async (clientId: string, clientName: string) => {
    if (!confirm(`¿Desactivar cliente "${clientName}"?`)) return;

    try {
      await deactivateClient(clientId);
      showToast.success('✅ Cliente desactivado');
      await loadClients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desactivando cliente';
      showToast.error(`❌ ${message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: '#f5f5f5' }}>
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" style={{ background: '#f5f5f5' }}>
      <ClientModalForm
        isOpen={showModal}
        isLoading={false}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateClient}
      />

      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#333333' }}>
                Gestión de Clientes
              </h1>
              <p className="text-sm mt-2" style={{ color: '#727272' }}>
                Gestiona todas las fichas de marca y contenido
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition font-medium hover:opacity-90"
              style={{ backgroundColor: '#6045E2' }}
            >
              <Plus size={20} />
              Nuevo Cliente
            </button>
          </div>
        </div>

        {/* Clients Grid */}
        {clients.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No hay clientes aún</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg transition font-medium hover:opacity-90"
              style={{ backgroundColor: '#6045E2' }}
            >
              <Plus size={20} />
              Crear primer cliente
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <div
                key={client.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: '#333333' }}>
                        {client.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#727272' }}>
                        @{client.slug}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        client.is_active
                          ? 'text-green-700 bg-green-100'
                          : 'text-gray-600 bg-gray-100'
                      }`}
                    >
                      {client.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {client.description && (
                    <p className="text-sm line-clamp-2" style={{ color: '#727272' }}>
                      {client.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 p-6 border-b border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#727272' }}>
                      Keywords
                    </p>
                    <p className="font-bold mt-1" style={{ color: '#333333' }}>
                      {(client.keywords_niche?.length || 0) + (client.keywords_longtail?.length || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#727272' }}>
                      Canales
                    </p>
                    <p className="font-bold mt-1" style={{ color: '#333333' }}>
                      {[
                        client.channel_blog,
                        client.channel_email,
                        client.channel_linkedin,
                        client.channel_instagram,
                      ].filter(Boolean).length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs" style={{ color: '#727272' }}>
                      Actualizado
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#727272' }}>
                      {new Date(client.updated_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>

                {/* Brand Colors */}
                {(client.color_primary || client.color_secondary) && (
                  <div className="p-6 border-b border-gray-200 flex gap-2">
                    {client.color_primary && (
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: client.color_primary }}
                        title={client.color_primary}
                      />
                    )}
                    {client.color_secondary && (
                      <div
                        className="w-8 h-8 rounded border border-gray-300"
                        style={{ backgroundColor: client.color_secondary }}
                        title={client.color_secondary}
                      />
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="p-6 flex gap-2 bg-gray-50">
                  <Link
                    href={`/clients/${client.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-white rounded-lg transition text-sm font-medium hover:opacity-90"
                    style={{ backgroundColor: '#6045E2' }}
                  >
                    <Edit2 size={16} />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDeleteClient(client.id, client.name)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium border border-red-200"
                  >
                    <Trash2 size={16} />
                    Desactivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
