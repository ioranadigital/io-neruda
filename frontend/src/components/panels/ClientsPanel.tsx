'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import { Client } from '@/src/types/client';
import { Plus, Edit2, Trash2, Users, Mail, Target, Globe } from 'lucide-react';
import ClientSelectorChip from '@/src/components/shared/ClientSelectorChip';

export default function ClientsPanel() {
  const router = useRouter();
  const { clients, deleteClient } = useGenerator();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAddClient = () => router.push('/clients/new');
  const handleEditClient = (client: Client) => router.push(`/clients/${client.id}`);

  const handleDeleteClient = (clientId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      deleteClient(clientId);
    }
  };

  const totalKeywords = (client: Client) => {
    if (!client.keywords_hierarchical) return 0;
    return Object.values(client.keywords_hierarchical).reduce(
      (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
      0
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-0 py-6 mb-6">
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}
            >
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {isHydrated ? `${clients.length} ${clients.length === 1 ? 'cliente registrado' : 'clientes registrados'}` : 'Cargando...'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ClientSelectorChip />
            <button
              onClick={handleAddClient}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg transition font-medium text-sm"
              style={{ backgroundColor: '#4aa87a' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3d9169'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4aa87a'; }}
            >
              <Plus size={18} />
              Nuevo Cliente
            </button>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-slate-200">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#e8f5ee' }}
          >
            <Users size={28} style={{ color: '#4aa87a' }} />
          </div>
          <p className="text-slate-600 font-medium mb-1">No hay clientes aún</p>
          <p className="text-sm text-slate-400 mb-5">Crea tu primer cliente para empezar a generar contenido</p>
          <button
            onClick={handleAddClient}
            className="flex items-center gap-2 px-5 py-2.5 text-white rounded-lg transition font-medium text-sm"
            style={{ backgroundColor: '#4aa87a' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3d9169'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4aa87a'; }}
          >
            <Plus size={18} />
            Crear primer cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {clients.map((client) => {
            const kws = totalKeywords(client);
            const initial = client.name.charAt(0).toUpperCase();
            return (
              <div
                key={client.id}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col"
                style={{ borderTop: '3px solid #4aa87a' }}
              >
                {/* Card header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}
                  >
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 truncate">{client.name}</h3>
                    {client.business_type && (
                      <p className="text-xs text-slate-500 truncate">{client.business_type}</p>
                    )}
                  </div>
                </div>

                {/* Client details */}
                <div className="space-y-1.5 mb-4 flex-1">
                  {client.email && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Mail size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.target_audience && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Target size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{client.target_audience}</span>
                    </div>
                  )}
                  {client.website_url && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Globe size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{client.website_url}</span>
                    </div>
                  )}
                </div>

                {/* Keyword count badge */}
                {kws > 0 && (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-3"
                    style={{ backgroundColor: '#e8f5ee', color: '#4aa87a' }}
                  >
                    {kws} keywords semánticas
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleEditClient(client)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition text-sm font-medium"
                    style={{ backgroundColor: '#e8f5ee', color: '#4aa87a' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#d4ece0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#e8f5ee'; }}
                  >
                    <Edit2 size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
