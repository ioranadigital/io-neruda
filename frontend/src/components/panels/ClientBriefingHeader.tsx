'use client';

import React from 'react';
import { Client } from '@/src/types/client';
import { Globe, Globe2, Zap, Languages, Radio } from 'lucide-react';

interface ClientBriefingHeaderProps {
  selectedClient: Client | null;
  clients: Client[];
  onSelectClient: (client: Client) => void;
}

export default function ClientBriefingHeader({
  selectedClient,
  clients,
  onSelectClient,
}: ClientBriefingHeaderProps) {
  const getEnabledChannels = () => {
    if (!selectedClient) return [];
    const channels = [];
    if (selectedClient.channel_blog) channels.push('Blog');
    if (selectedClient.channel_email) channels.push('Email');
    if (selectedClient.channel_linkedin) channels.push('LinkedIn');
    if (selectedClient.channel_instagram) channels.push('Instagram');
    if (selectedClient.channel_twitter) channels.push('Twitter');
    if (selectedClient.channel_tiktok) channels.push('TikTok');
    if (selectedClient.channel_youtube) channels.push('YouTube');
    return channels;
  };

  return (
    <div className="px-6 py-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <div className="grid grid-cols-5 gap-4">
        {/* 1. Selector de Cliente */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-600 mb-2">Seleccionar Cliente</label>
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = clients.find((c) => c.id === e.target.value);
              if (client) onSelectClient(client);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">-- Selecciona cliente --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Información del Cliente */}
        {selectedClient && (
          <>
            {/* Tipo de Negocio */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-2">Tipo de Negocio</label>
              <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-800">
                  {selectedClient.business_type || 'No especificado'}
                </p>
              </div>
            </div>

            {/* URL Sitio Web */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Globe size={14} />
                Sitio Web
              </label>
              {selectedClient.website_url ? (
                <a
                  href={selectedClient.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 text-blue-700 text-xs font-medium hover:bg-blue-100 transition truncate"
                >
                  {selectedClient.website_url.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500">No configurado</p>
                </div>
              )}
            </div>

            {/* Tono por Defecto */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Zap size={14} />
                Tono Defecto
              </label>
              <div className="px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900 capitalize">
                  {selectedClient.default_tone || 'professional'}
                </p>
              </div>
            </div>

            {/* Idioma Configurado */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Languages size={14} />
                Idioma
              </label>
              <div className="px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900">
                  {selectedClient.supported_languages?.[0] || 'Español'}
                </p>
              </div>
            </div>

            {/* Canales Habilitados */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
                <Radio size={14} />
                Canales
              </label>
              <div className="flex flex-wrap gap-1">
                {getEnabledChannels().length > 0 ? (
                  getEnabledChannels().slice(0, 3).map((channel) => (
                    <span
                      key={channel}
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium"
                    >
                      {channel}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-1 text-gray-500 text-xs">Sin canales</span>
                )}
                {getEnabledChannels().length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                    +{getEnabledChannels().length - 3}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {!selectedClient && (
          <div className="col-span-4 flex items-center justify-center">
            <p className="text-sm text-gray-500">Selecciona un cliente para ver sus datos</p>
          </div>
        )}
      </div>
    </div>
  );
}
