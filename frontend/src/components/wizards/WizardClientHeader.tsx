'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Client } from '@/src/types/client';

interface WizardClientHeaderProps {
  selectedClient: Client | null;
  clients: Client[];
  onSelectClient: (client: Client | null) => void;
}

export default function WizardClientHeader({
  selectedClient,
  clients,
  onSelectClient,
}: WizardClientHeaderProps) {

  return (
    <div className="w-full">
      {/* LÍNEA ÚNICA: Izquierda | Derecha */}
      <div className="flex items-center justify-between gap-8">

        {/* IZQUIERDA */}
        <div className="flex-1 min-w-0">
          {selectedClient ? (
            <div>
              <p className="text-lg font-bold text-gray-900">{selectedClient.name}</p>
              <p className="text-sm text-gray-500">{selectedClient.business_type || 'Cliente'}</p>
            </div>
          ) : (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-base text-red-700 font-medium">Selecciona un Cliente para Continuar</p>
            </div>
          )}
        </div>

        {/* DERECHA */}
        <div className="flex-shrink-0 whitespace-nowrap">
          {selectedClient ? (
            <button
              onClick={() => onSelectClient(null)}
              className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
            >
              Cambiar Cliente
            </button>
          ) : (
            <>
              {clients.length > 0 ? (
                <select
                  defaultValue=""
                  onChange={(e) => {
                    const client = clients.find((c) => c.id === e.target.value);
                    onSelectClient(client || null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none transition font-medium text-sm"
                >
                  <option value="">Selecciona un cliente...</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} - {client.business_type}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>No hay clientes</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
