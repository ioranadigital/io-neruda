'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Client } from '../../types/client';
import { ChevronDown, Plus, Search } from 'lucide-react';

interface ClientSelectorProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
  isLoading?: boolean;
}

export default function ClientSelector({
  clients,
  selectedClient,
  onSelectClient,
  isLoading = false,
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 transition flex items-center justify-between disabled:opacity-50"
      >
        <div className="text-left">
          {selectedClient ? (
            <>
              <p className="text-sm text-gray-500">Cliente seleccionado</p>
              <p className="font-semibold text-gray-800">{selectedClient.name}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">Selecciona un cliente</p>
              <p className="font-semibold text-gray-400">Sin cliente</p>
            </>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Client List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                    selectedClient?.id === client.id ? 'bg-blue-100' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.slug}</p>
                  </div>
                  {selectedClient?.id === client.id && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No se encontraron clientes
              </div>
            )}
          </div>

          {/* Manage Clients Link */}
          <Link
            href="/clients"
            className="w-full px-4 py-3 text-blue-600 hover:bg-blue-50 transition flex items-center gap-2 font-medium border-t border-gray-100"
          >
            <Plus size={16} />
            Gestionar clientes
          </Link>
        </div>
      )}
    </div>
  );
}
