'use client';

import React, { useState } from 'react';
import { Plus, Check, X, Settings, Trash2 } from 'lucide-react';
import { showToast } from '../shared/Toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  config?: {
    url?: string;
    apiKey?: string;
    username?: string;
  };
}

export default function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Publica contenido directamente en tu sitio WordPress',
      icon: '📝',
      status: 'disconnected',
    },
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    username: '',
    apiKey: '',
  });

  const handleOpenModal = (integration: Integration) => {
    setSelectedIntegration(integration);
    setFormData({
      url: integration.config?.url || '',
      username: integration.config?.username || '',
      apiKey: integration.config?.apiKey || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIntegration(null);
    setFormData({ url: '', username: '', apiKey: '' });
  };

  const handleConnect = () => {
    if (!formData.url || !formData.username || !formData.apiKey) {
      showToast.error('❌ Por favor completa todos los campos');
      return;
    }

    if (!formData.url.startsWith('http')) {
      showToast.error('❌ La URL debe comenzar con http:// o https://');
      return;
    }

    if (selectedIntegration) {
      setIntegrations(
        integrations.map(i =>
          i.id === selectedIntegration.id
            ? {
                ...i,
                status: 'connected',
                config: {
                  url: formData.url,
                  username: formData.username,
                  apiKey: formData.apiKey,
                },
              }
            : i
        )
      );
      showToast.success('✅ Integración conectada exitosamente');
      handleCloseModal();
    }
  };

  const handleDisconnect = (integrationId: string) => {
    if (window.confirm('¿Desconectar esta integración?')) {
      setIntegrations(
        integrations.map(i =>
          i.id === integrationId
            ? { ...i, status: 'disconnected', config: undefined }
            : i
        )
      );
      showToast.success('✅ Integración desconectada');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Herramientas Integradas</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          <Plus size={18} />
          Nueva Integración
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map(integration => (
          <div
            key={integration.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition"
          >
            {/* Integration Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              {integration.status === 'connected' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700">
                  <Check size={16} />
                  <span className="text-xs font-medium">Conectado</span>
                </div>
              )}
              {integration.status === 'disconnected' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  <X size={16} />
                  <span className="text-xs font-medium">Desconectado</span>
                </div>
              )}
            </div>

            {/* Connection Details */}
            {integration.config && integration.status === 'connected' && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 font-medium mb-2">Detalles de conexión:</p>
                <div className="space-y-1 text-xs text-green-700">
                  <p><span className="font-medium">URL:</span> {integration.config.url}</p>
                  <p><span className="font-medium">Usuario:</span> {integration.config.username}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(integration)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
              >
                <Settings size={16} />
                {integration.status === 'connected' ? 'Reconfigurar' : 'Conectar'}
              </button>

              {integration.status === 'connected' && (
                <button
                  onClick={() => handleDisconnect(integration.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {isModalOpen && selectedIntegration && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal} />

          {/* Modal */}
          <div className="absolute inset-4 md:inset-12 lg:inset-32 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedIntegration.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedIntegration.name}</h2>
                  <p className="text-sm text-gray-600">Configura tu conexión</p>
                </div>
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
              {selectedIntegration.id === 'wordpress' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      URL del sitio WordPress
                    </label>
                    <input
                      type="url"
                      placeholder="https://ejemplo.com"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ej: https://micapital.com (sin barra al final)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Usuario WordPress
                    </label>
                    <input
                      type="text"
                      placeholder="tu_usuario"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Usuario con permisos de autor o administrador
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña de aplicación / API Key
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••••••••••"
                      value={formData.apiKey}
                      onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Usa una contraseña de aplicación. En WordPress: Usuarios → Tu Perfil → Contraseñas de Aplicación
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-2">📋 Requisitos:</p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>WordPress 5.6 o superior</li>
                      <li>API REST habilitada (normalmente viene por defecto)</li>
                      <li>Usuario con permisos de publicación</li>
                    </ul>
                  </div>
                </>
              )}
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
