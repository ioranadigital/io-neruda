'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Client } from '@/src/types/client';
import { Template, TemplateInjection } from '@/src/types/templates';
import { MASTER_TEMPLATES } from '@/src/data/templates';

interface PasoClienteWelcomeProps {
  clients: Client[];
  onSelectClient: (client: Client | null) => void;
  isFromTemplate?: boolean;
  templateName?: string | null;
}

export default function PasoClienteWelcome({
  clients,
  onSelectClient,
  isFromTemplate = false,
  templateName = null,
}: PasoClienteWelcomeProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleSelectClient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = e.target.value;
    setSelectedClientId(clientId);
  };

  const handleContinue = () => {
    // Si hay plantilla seleccionada, inyectarla primero
    if (selectedTemplate) {
      const injectionPayload: TemplateInjection = {
        tipoPropuesta: selectedTemplate.targetPropuesta,
        subcategoriaPropuesta: selectedTemplate.subcategoria,
        promptEstructuraFijada: selectedTemplate.structurePrompt,
        templateName: selectedTemplate.nombre,
        templateId: selectedTemplate.id,
      };
      sessionStorage.setItem('template-injection', JSON.stringify(injectionPayload));
      sessionStorage.setItem('template-source', 'true');
    }

    const client = clients.find((c) => c.id === selectedClientId);
    onSelectClient(client || null);
  };

  const handleUseTemplate = (template: Template) => {
    // Solo guardar en estado, SIN reload
    setSelectedTemplate(template);
  };

  return (
    <div className="w-full space-y-6 px-4 py-6">
      {/* Banner si viene de template */}
      {isFromTemplate && templateName && (
        <div
          className="flex items-start gap-3 px-5 py-4 rounded-lg border-l-4"
          style={{
            backgroundColor: '#f0fdff',
            borderColor: '#06b6d4',
          }}
        >
          <CheckCircle size={18} style={{ color: '#0891b2', flexShrink: 0 }} className="mt-0.5" />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#0e7490' }}>
              Plantilla seleccionada
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#0c6b7d' }}>
              Usarás la estructura de <strong>{templateName}</strong> para generar contenido
            </p>
          </div>
        </div>
      )}

      {/* BLOQUE 1: Selector de Cliente */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">1. Selecciona un Cliente</h2>
          <p className="text-sm text-slate-600">Este cliente será el contexto para generar el contenido</p>
        </div>

        {clients.length > 0 ? (
          <select
            value={selectedClientId}
            onChange={handleSelectClient}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium text-sm"
          >
            <option value="">Selecciona un cliente...</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.business_type}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>
              No hay clientes creados.{' '}
              <Link href="/clients/new" className="underline font-semibold">
                Crear primer cliente
              </Link>
            </span>
          </div>
        )}
      </div>

      {/* BLOQUE 2: Plantillas */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">2. Elige una Plantilla (Opcional)</h2>
          <p className="text-sm text-slate-600">Selecciona una estructura de contenido o crea desde cero</p>
        </div>

        {/* Agrupar por propuesta */}
        {(['guide', 'comparison', 'tips', 'case_study', 'tutorial', 'trends'] as const).map(
          (propuestaType) => {
            const propuestaLabels: Record<string, string> = {
              'guide': 'Guía Completa',
              'comparison': 'Comparativa',
              'tips': 'Tips & Trucos',
              'case_study': 'Caso de Estudio',
              'tutorial': 'Tutorial Paso a Paso',
              'trends': 'Tendencias & Futuro',
            };

            const templatesByPropuesta = MASTER_TEMPLATES.filter(
              (t) => t.targetPropuesta === propuestaType
            );
            if (templatesByPropuesta.length === 0) return null;

            return (
              <div key={propuestaType} className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 pl-1 border-l-4" style={{ borderColor: '#4aa87a' }}>
                  {propuestaLabels[propuestaType]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesByPropuesta.map((template) => (
            <button
              key={template.id}
              onClick={() => handleUseTemplate(template)}
              className="text-left p-4 rounded-lg border-2 transition-all hover:shadow-md"
              style={{
                borderColor: template.colorBadge + '40',
                backgroundColor: template.colorBadge + '08',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  template.colorBadge + '80';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${template.colorBadge}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  template.colorBadge + '40';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: template.colorBadge }}>
                    🏷️ {template.categoria}
                  </p>
                  <h3 className="font-bold text-sm text-slate-900">{template.nombre}</h3>
                </div>
              </div>

              {/* Subcategoría */}
              <p className="text-xs text-slate-500 mb-2">→ {template.subcategoria}</p>

              {/* Description */}
              <p className="text-xs text-slate-600 mb-3 line-clamp-2">{template.descripcion}</p>

              {/* Footer - CTA */}
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: template.colorBadge }}>
                {selectedTemplate?.id === template.id ? (
                  <>
                    <CheckCircle size={13} />
                    Seleccionada
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    Usar este molde
                    <ArrowRight size={12} />
                  </>
                )}
              </div>
            </button>
                  ))}
                </div>
              </div>
            );
          }
        )}

        {/* Info */}
        <div className="bg-slate-50 rounded p-3 mt-4">
          <p className="text-xs text-slate-600">
            💡 <strong>Tip:</strong> Selecciona una plantilla para usar su estructura de contenido, o continúa
            sin plantilla para crear desde cero.
          </p>
        </div>
      </div>

      {/* Summary Banner */}
      {selectedClientId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            <p className="text-sm font-semibold text-green-900">
              Cliente: <span className="text-green-700">{clients.find(c => c.id === selectedClientId)?.name}</span>
            </p>
          </div>
          {selectedTemplate && (
            <div className="flex items-center gap-2 ml-6">
              <Sparkles size={16} className="text-green-600" />
              <p className="text-sm text-green-800">
                Plantilla: <span className="font-semibold">{selectedTemplate.nombre}</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* CONTINUAR Button - Only enabled if client selected */}
      <div className="flex justify-end">
        <button
          onClick={handleContinue}
          disabled={!selectedClientId}
          className="px-8 py-3 rounded-lg font-semibold text-white transition-all flex items-center gap-2"
          style={{
            backgroundColor: selectedClientId ? '#4aa87a' : '#ccc',
            cursor: selectedClientId ? 'pointer' : 'not-allowed',
          }}
        >
          Continuar al Paso 2
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
