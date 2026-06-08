'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../../src/context/GeneratorContext';
import PlanGeneratorPanel from '../../../src/components/panels/PlanGeneratorPanel';

export default function PlanGeneratorPage() {
  const { clients, selectedClient, selectClient } = useGenerator();

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: '#f5f5f5' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">📋 Plan Generator</h1>
        <p className="text-sm text-gray-600 mt-1">
          Crea planes maestros de contenido que luego puedas usar en el generador
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <PlanGeneratorPanel
          clients={clients}
          selectedClient={selectedClient}
          onSelectClient={selectClient}
        />
      </div>
    </div>
  );
}
