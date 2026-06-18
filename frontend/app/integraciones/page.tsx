'use client';

import React, { useState } from 'react';
import {
  Zap, Settings, Globe, Lock, BarChart3, Bell, Mail,
  CheckCircle, Circle, AlertCircle
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  category: string;
  status: 'connected' | 'pending' | 'error';
  icon: React.ReactNode;
  description: string;
  lastSync?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Base de Datos',
    status: 'connected',
    icon: <Globe size={24} />,
    description: 'Base de datos PostgreSQL y autenticación',
    lastSync: '2026-06-08 14:32'
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    category: 'IA',
    status: 'connected',
    icon: <Zap size={24} />,
    description: 'Generación de contenido con GPT',
    lastSync: '2026-06-08 15:15'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Pagos',
    status: 'pending',
    icon: <Lock size={24} />,
    description: 'Procesamiento de pagos y suscripciones',
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    category: 'Email',
    status: 'connected',
    icon: <Mail size={24} />,
    description: 'Envío de emails transaccionales',
    lastSync: '2026-06-08 13:45'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Notificaciones',
    status: 'pending',
    icon: <Bell size={24} />,
    description: 'Notificaciones y alertas',
  },
  {
    id: 'analytics',
    name: 'Google Analytics',
    category: 'Analítica',
    status: 'connected',
    icon: <BarChart3 size={24} />,
    description: 'Seguimiento de eventos y métricas',
    lastSync: '2026-06-08 16:00'
  },
  {
    id: 'n8n',
    name: 'n8n',
    category: 'Automatización',
    status: 'connected',
    icon: <Settings size={24} />,
    description: 'Flujos de trabajo y automatizaciones',
    lastSync: '2026-06-08 14:22'
  },
];

export default function IntegracionesPage() {
  const [integraciones] = useState<Integration[]>(INTEGRATIONS);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' };
      case 'pending':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-600' };
      case 'error':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-600' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'pending':
        return 'Pendiente';
      case 'error':
        return 'Error';
      default:
        return 'Desconocido';
    }
  };

  const categories = Array.from(new Set(integraciones.map(i => i.category)));

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-6 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Integraciones</h1>
          <p className="text-slate-600">Conecta y gestiona integraciones externas</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto w-full">
        <div className="px-6 md:px-8 py-6 w-full">
          {integraciones.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-lg mb-4">No hay integraciones disponibles</p>
            </div>
          ) : (
            <div className="space-y-8">
              {categories.map(category => {
                const categoryIntegrations = integraciones.filter(i => i.category === category);
                return (
                  <div key={category}>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">{category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {categoryIntegrations.map(integration => {
                        const colors = getStatusColor(integration.status);
                        return (
                          <div
                            key={integration.id}
                            className={`${colors.bg} ${colors.border} rounded-lg border p-6 flex flex-col`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className={`${colors.icon}`}>
                                {integration.icon}
                              </div>
                              <div className={`${colors.icon}`}>
                                {integration.status === 'connected' ? (
                                  <CheckCircle size={20} />
                                ) : integration.status === 'pending' ? (
                                  <Circle size={20} />
                                ) : (
                                  <AlertCircle size={20} />
                                )}
                              </div>
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                              {integration.name}
                            </h3>

                            <p className="text-sm text-slate-600 mb-4 flex-1">
                              {integration.description}
                            </p>

                            {integration.lastSync && (
                              <p className="text-xs text-slate-500 mb-4">
                                Última sincronización: {integration.lastSync}
                              </p>
                            )}

                            <div className="flex gap-2">
                              {integration.status === 'connected' ? (
                                <>
                                  <button className="flex-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition">
                                    Configurar
                                  </button>
                                  <button className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition">
                                    Desconectar
                                  </button>
                                </>
                              ) : (
                                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                                  Conectar
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

