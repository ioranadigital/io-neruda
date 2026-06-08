'use client';

import React from 'react';
import ClientIntegrationsPanel from '@/src/components/panels/ClientIntegrationsPanel';
import { useGenerator } from '@/src/context/GeneratorContext';

export default function IntegracionesPage() {
  const { clients } = useGenerator();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Integraciones</h1>
        <p className="text-gray-600 mt-2">Configura conexiones con herramientas externas para cada cliente</p>
      </div>

      <div className="flex-1 overflow-auto">
        <ClientIntegrationsPanel clients={clients} />
      </div>
    </div>
  );
}
