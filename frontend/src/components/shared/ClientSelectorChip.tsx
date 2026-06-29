'use client';

import { ChevronDown } from 'lucide-react';
import { useGenerator } from '@/src/context/GeneratorContext';
import { Client } from '@/src/types/client';

interface ClientSelectorChipProps {
  onAfterChange?: (client: Client | null) => void;
}

export default function ClientSelectorChip({ onAfterChange }: ClientSelectorChipProps) {
  const { clients, selectedClient, selectClient } = useGenerator();

  const handleSelect = (client: Client | null) => {
    selectClient(client);
    onAfterChange?.(client);
  };

  if (selectedClient) {
    const initial = selectedClient.name.charAt(0).toUpperCase();
    const subtitle =
      selectedClient.business_type ||
      selectedClient.description?.slice(0, 40) ||
      selectedClient.slug ||
      '';

    return (
      <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}
        >
          {initial}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-tight truncate max-w-[160px]">
            {selectedClient.name}
          </p>
          {subtitle && (
            <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[160px]">
              {subtitle}
            </p>
          )}
        </div>

        <button
          onClick={() => handleSelect(null)}
          className="ml-1 text-xs font-semibold whitespace-nowrap px-2 py-1 rounded-lg transition"
          style={{ color: '#4aa87a' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f0faf5')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          Cambiar
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value=""
        onChange={e => {
          const client = clients.find(c => c.id === e.target.value);
          if (client) handleSelect(client);
        }}
        className="appearance-none pl-3 pr-8 py-2 text-sm font-medium rounded-xl bg-white focus:outline-none cursor-pointer transition"
        style={{
          border: '2px solid #4aa87a',
          color: '#374151',
        }}
      >
        <option value="" disabled>
          Selecciona cliente
        </option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#4aa87a' }}
      />
    </div>
  );
}
