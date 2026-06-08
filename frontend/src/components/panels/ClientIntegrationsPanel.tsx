'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Check, AlertCircle, Trash2, Linkedin, Instagram, Facebook } from 'lucide-react';
import { showToast } from '../shared/Toast';
import { ClientIntegrations } from '@/src/types/integrations';
import { Client } from '@/src/types/client';

interface ClientIntegrationsPanelProps {
  clients: Client[];
}

interface ToolConfig {
  name: string;
  icon: string;
  color: string;
  description: string;
  fields: Array<{ key: string; label: string; type: string; placeholder: string }>;
}

const TOOLS: Record<string, ToolConfig> = {
  wordpress: {
    name: 'WordPress',
    icon: '📝',
    color: '#4891A6',
    description: 'Publica posts en tu sitio WordPress',
    fields: [
      { key: 'url', label: 'URL del sitio', type: 'url', placeholder: 'https://ejemplo.com' },
      { key: 'username', label: 'Usuario', type: 'text', placeholder: 'tu_usuario' },
      { key: 'apiKey', label: 'Contraseña de aplicación', type: 'password', placeholder: '••••••••••••••••' },
    ],
  },
  linkedin: {
    name: 'LinkedIn',
    icon: '💼',
    color: '#0A66C2',
    description: 'Comparte contenido en LinkedIn',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '••••••••••••••••' },
      { key: 'accountId', label: 'Account ID', type: 'text', placeholder: 'urn:li:person:XXXXXXX' },
    ],
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    color: '#E4405F',
    description: 'Publica fotos y videos en Instagram',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '••••••••••••••••' },
      { key: 'accountId', label: 'Account ID', type: 'text', placeholder: 'xxxxxxxxx' },
    ],
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    color: '#000000',
    description: 'Comparte videos en TikTok',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '••••••••••••••••' },
      { key: 'accountId', label: 'Account ID', type: 'text', placeholder: 'xxxxxxxxx' },
    ],
  },
  facebook: {
    name: 'Facebook',
    icon: 'f',
    color: '#1877F2',
    description: 'Comparte contenido en Facebook',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '••••••••••••••••' },
      { key: 'accountId', label: 'Page ID', type: 'text', placeholder: 'xxxxxxxxx' },
    ],
  },
  x: {
    name: 'X (Twitter)',
    icon: '𝕏',
    color: '#000000',
    description: 'Publica tweets en X',
    fields: [
      { key: 'accessToken', label: 'API Key', type: 'password', placeholder: '••••••••••••••••' },
      { key: 'accountId', label: 'API Secret', type: 'password', placeholder: '••••••••••••••••' },
    ],
  },
  googlemybusiness: {
    name: 'Google My Business',
    icon: '🏢',
    color: '#EA4335',
    description: 'Gestiona tu presencia en Google My Business',
    fields: [
      { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: '••••••••••••••••' },
      { key: 'accountId', label: 'Business Account ID', type: 'text', placeholder: 'accounts/xxxxxxxxx' },
      { key: 'accountName', label: 'Nombre del negocio', type: 'text', placeholder: 'Mi Negocio' },
    ],
  },
};

export default function ClientIntegrationsPanel({ clients }: ClientIntegrationsPanelProps) {
  const [clientIntegrations, setClientIntegrations] = useState<Map<string, ClientIntegrations>>(new Map());
  const [selectedClient, setSelectedClient] = useState<Client | null>(clients[0] || null);
  const [selectedTool, setSelectedTool] = useState<string>('wordpress');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Load integrations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('client-integrations');
      if (stored) {
        const parsed = JSON.parse(stored);
        setClientIntegrations(new Map(parsed));
      }
    } catch (error) {
      console.error('Error loading integrations:', error);
    }
  }, []);

  // Save integrations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('client-integrations', JSON.stringify(Array.from(clientIntegrations.entries())));
    } catch (error) {
      console.error('Error saving integrations:', error);
    }
  }, [clientIntegrations]);

  const getClientIntegrations = (clientId: string): ClientIntegrations => {
    if (!clientIntegrations.has(clientId)) {
      const client = clients.find(c => c.id === clientId);
      return {
        clientId,
        clientName: client?.name || '',
        wordpress: { isConnected: false },
        linkedin: { isConnected: false },
        instagram: { isConnected: false },
        tiktok: { isConnected: false },
        facebook: { isConnected: false },
        x: { isConnected: false },
        googlemybusiness: { isConnected: false },
      };
    }
    return clientIntegrations.get(clientId)!;
  };

  const getToolIntegration = (tool: string) => {
    if (!selectedClient) return { isConnected: false };
    const integration = getClientIntegrations(selectedClient.id);
    return (integration as any)[tool] || { isConnected: false };
  };

  const handleOpenModal = (tool: string) => {
    const toolIntegration = getToolIntegration(tool);
    const toolConfig = TOOLS[tool];

    const newFormData: Record<string, string> = {};
    toolConfig.fields.forEach(field => {
      newFormData[field.key] = (toolIntegration as any)[field.key] || '';
    });

    setSelectedTool(tool);
    setFormData(newFormData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({});
  };

  const handleConnect = () => {
    const toolConfig = TOOLS[selectedTool];
    const isComplete = toolConfig.fields.every(field => formData[field.key]);

    if (!isComplete) {
      showToast.error('❌ Por favor completa todos los campos');
      return;
    }

    if (selectedClient) {
      const newIntegrations = new Map(clientIntegrations);
      const integration = getClientIntegrations(selectedClient.id);

      (integration as any)[selectedTool] = {
        isConnected: true,
        ...formData,
        lastSync: new Date().toISOString(),
      };

      newIntegrations.set(selectedClient.id, integration);
      setClientIntegrations(newIntegrations);
      showToast.success(`✅ ${toolConfig.name} conectado exitosamente`);
      handleCloseModal();
    }
  };

  const handleDisconnect = (tool: string) => {
    if (window.confirm(`¿Desconectar ${TOOLS[tool].name}?`)) {
      if (selectedClient) {
        const newIntegrations = new Map(clientIntegrations);
        const integration = getClientIntegrations(selectedClient.id);

        (integration as any)[tool] = { isConnected: false };

        newIntegrations.set(selectedClient.id, integration);
        setClientIntegrations(newIntegrations);
        showToast.success('✅ Integración desconectada');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Integraciones por Cliente</h2>
        <p className="text-sm text-gray-600 mt-1">Configura herramientas para cada cliente</p>
      </div>

      {/* Client Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {clients.map(client => (
          <button
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              selectedClient?.id === client.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {client.name}
          </button>
        ))}
      </div>

      {selectedClient && (
        <>
          {/* Tools Tabs */}
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Tab Buttons */}
            <div className="flex gap-2 border-b border-gray-200 p-4 overflow-x-auto">
              {Object.entries(TOOLS).map(([toolKey, tool]) => {
                const toolIntegration = getToolIntegration(toolKey);
                const isActive = selectedTool === toolKey;

                return (
                  <button
                    key={toolKey}
                    onClick={() => setSelectedTool(toolKey)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={isActive ? { backgroundColor: tool.color } : {}}
                  >
                    <span className="text-lg">{tool.icon}</span>
                    <span>{tool.name}</span>
                    {toolIntegration.isConnected && (
                      <Check size={16} className="ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tool Content */}
            <div className="p-6">
              {selectedTool && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {TOOLS[selectedTool].name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {TOOLS[selectedTool].description}
                    </p>
                  </div>

                  {/* Status Box */}
                  <div
                    className="p-4 rounded-lg border-l-4"
                    style={{
                      backgroundColor: getToolIntegration(selectedTool).isConnected ? '#f0fdf4' : '#fafafa',
                      borderColor: getToolIntegration(selectedTool).isConnected ? '#22c55e' : '#d1d5db',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {getToolIntegration(selectedTool).isConnected ? (
                        <>
                          <Check size={20} className="text-green-600" />
                          <div>
                            <p className="font-semibold text-green-900">Conectado</p>
                            <p className="text-xs text-green-700">
                              {getToolIntegration(selectedTool).accountName &&
                                `Cuenta: ${getToolIntegration(selectedTool).accountName}`}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={20} className="text-amber-600" />
                          <div>
                            <p className="font-semibold text-amber-900">No conectado</p>
                            <p className="text-xs text-amber-700">Haz clic en "Conectar" para configurar</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(selectedTool)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition"
                      style={{
                        backgroundColor: TOOLS[selectedTool].color,
                        color: 'white',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      <Settings size={18} />
                      {getToolIntegration(selectedTool).isConnected ? 'Reconfigurar' : 'Conectar'}
                    </button>

                    {getToolIntegration(selectedTool).isConnected && (
                      <button
                        onClick={() => handleDisconnect(selectedTool)}
                        className="px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Configuration Modal */}
      {isModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />

          {/* Modal */}
          <div className="absolute inset-4 md:inset-12 lg:inset-32 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Conectar {TOOLS[selectedTool].name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Cliente: {selectedClient.name}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {TOOLS[selectedTool].fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">📋 Requisitos:</p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  {selectedTool === 'wordpress' && (
                    <>
                      <li>WordPress 5.6 o superior</li>
                      <li>API REST habilitada</li>
                      <li>Usuario con permisos de publicación</li>
                    </>
                  )}
                  {selectedTool !== 'wordpress' && (
                    <>
                      <li>Cuenta activa en {TOOLS[selectedTool].name}</li>
                      <li>Token de acceso con permisos de publicación</li>
                      <li>Aplicación registrada en la plataforma</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleConnect}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition font-medium flex items-center gap-2"
                style={{ backgroundColor: TOOLS[selectedTool].color }}
              >
                <Check size={16} />
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
