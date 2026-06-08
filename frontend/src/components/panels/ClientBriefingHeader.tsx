'use client';

import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { Globe, Zap, Languages, Radio, Building2, ChevronDown, ChevronUp, Users } from 'lucide-react';

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
  const [isExpanded, setIsExpanded] = useState(true);

  const getEnabledChannels = (): string[] => {
    if (!selectedClient) return [];
    const channels: string[] = [];
    if (selectedClient.channel_blog) channels.push('📝 Blog');
    if (selectedClient.channel_email) channels.push('📧 Email');
    if (selectedClient.channel_linkedin) channels.push('💼 LinkedIn');
    if (selectedClient.channel_instagram) channels.push('📸 Instagram');
    if (selectedClient.channel_twitter) channels.push('𝕏 Twitter');
    if (selectedClient.channel_tiktok) channels.push('🎬 TikTok');
    if (selectedClient.channel_youtube) channels.push('▶️ YouTube');
    return channels;
  };

  const webColors = {
    primary: '#7BF1A8',
    primaryDark: '#333333',
    greenLight: '#f0fdf7',
    greenLighter: '#f8fffc',
  };

  return (
    <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: webColors.primary, backgroundColor: '#ffffff' }}>
      {/* Header with Client Selector */}
      <div className="px-6 py-4 flex items-center justify-between gap-4" style={{ backgroundColor: '#ffffff' }}>
        <div className="flex items-center gap-4 flex-1">
          <div style={{ color: webColors.primary }}>
            <Users size={24} />
          </div>
          <div className="text-left min-w-0">
            <h3 className="font-bold text-gray-900 text-lg">Seleccionar Cliente</h3>
            <p className="text-sm text-gray-600">Datos e información del cliente</p>
          </div>
        </div>

        {/* Client Selector - Always Visible */}
        <div className="w-64 relative flex-shrink-0">
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = clients.find((c) => c.id === e.target.value);
              if (client) onSelectClient(client);
            }}
            className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold focus:ring-2 focus:outline-none bg-white cursor-pointer appearance-none pr-8"
            style={{ borderColor: webColors.primary, color: webColors.primaryDark }}
          >
            <option value="">-- Selecciona cliente --</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 top-3 pointer-events-none" style={{ color: webColors.primary }} />
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-50 rounded transition flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronUp size={20} style={{ color: webColors.primary }} />
          ) : (
            <ChevronDown size={20} style={{ color: webColors.primary }} />
          )}
        </button>
      </div>

      {/* INFORMACIÓN DEL CLIENTE - COLAPSABLE */}
      {isExpanded && (
        <div className="px-8 py-4 border-t-2 space-y-4" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
          {/* INFORMACIÓN DEL CLIENTE - COLAPSABLE */}
        {selectedClient && (
          <div className="space-y-4 animate-in fade-in duration-300">
          {/* FILA 1: Grid de 4 columnas con datos del cliente */}
          <div className="grid grid-cols-4 gap-3">
            {/* Tipo de Negocio */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <Building2 size={14} style={{ color: webColors.primary }} />
                Tipo de Negocio
              </p>
              <p className="text-sm font-bold text-gray-800">
                {selectedClient.business_type || 'No especificado'}
              </p>
            </div>

            {/* Sitio Web */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <Globe size={14} style={{ color: webColors.primary }} />
                Sitio Web
              </p>
              {selectedClient.website_url ? (
                <a
                  href={selectedClient.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium hover:underline truncate block"
                  style={{ color: webColors.primary }}
                >
                  {selectedClient.website_url.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              ) : (
                <p className="text-xs text-gray-500">No configurado</p>
              )}
            </div>

            {/* Tono por Defecto */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <Zap size={14} style={{ color: webColors.primary }} />
                Tono Defecto
              </p>
              <p className="text-sm font-bold text-gray-800 capitalize">
                {selectedClient.default_tone || 'professional'}
              </p>
            </div>

            {/* Idioma */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                <Languages size={14} style={{ color: webColors.primary }} />
                Idioma
              </p>
              <p className="text-sm font-bold text-gray-800">
                {selectedClient.supported_languages?.[0] || 'Español'}
              </p>
            </div>
          </div>

          {/* FILA 3: Canales Habilitados */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
              <Radio size={14} style={{ color: webColors.primary }} />
              Canales Activos
            </p>
            <div className="flex flex-wrap gap-2">
              {getEnabledChannels().length > 0 ? (
                getEnabledChannels().map((channel) => (
                  <span
                    key={channel}
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: webColors.primary, color: webColors.primaryDark }}
                  >
                    {channel}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">Sin canales configurados</span>
              )}
            </div>
          </div>
          </div>
        )}
        </div>
      )}

      {!selectedClient && isExpanded && (
        <div className="px-8 py-6 border-t-2 flex items-center justify-center" style={{ borderColor: webColors.primary, backgroundColor: webColors.greenLighter }}>
          <p className="text-sm text-gray-500">Selecciona un cliente para ver sus datos</p>
        </div>
      )}
    </div>
  );
}
