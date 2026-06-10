'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MASTER_TEMPLATES } from '@/src/data/templates';
import { Template, TemplateInjection } from '@/src/types/templates';
import {
  Sparkles,
  ArrowRight,
  Scale3d,
  ShoppingCart,
  Wrench,
  MessageCircle,
  Brain
} from 'lucide-react';

// Icon mapper
const ICON_MAP: Record<string, React.ReactNode> = {
  'Scale3d': <Scale3d size={32} />,
  'ShoppingCart': <ShoppingCart size={32} />,
  'Wrench': <Wrench size={32} />,
  'MessageCircle': <MessageCircle size={32} />,
  'Brain': <Brain size={32} />,
};

export default function TemplatesListView() {
  const router = useRouter();

  // Handle template selection and injection
  const handleUseTemplate = (template: Template) => {
    // Create injection payload
    const injectionPayload: TemplateInjection = {
      tipoPropuesta: template.targetPropuesta,
      subcategoriaPropuesta: template.subcategoria,
      promptEstructuraFijada: template.structurePrompt,
    };

    // Store in sessionStorage for GeneratorPanel to pick up
    sessionStorage.setItem('template-injection', JSON.stringify(injectionPayload));
    sessionStorage.setItem('template-source', 'true');

    // Navigate to PASO 0 (Client Selection) in GeneratorPanel
    router.push('/generators?step=0');
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={28} style={{ color: '#18bdc1' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#18bdc1' }}>
            Factoría de Plantillas
          </h1>
        </div>
        <p style={{ color: '#727272' }} className="text-sm">
          Repositorio de moldes de contenido optimizados. Selecciona una plantilla y redacta directamente.
        </p>
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MASTER_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            style={{ borderColor: '#e0e0e0' }}
          >
            {/* Card Header with Category Badge */}
            <div
              className="px-6 py-4 text-white"
              style={{ backgroundColor: template.colorBadge }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-white">
                  {ICON_MAP[template.icon]}
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded bg-white/20">
                  {template.categoria}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white">{template.nombre}</h2>
            </div>

            {/* Card Content */}
            <div className="px-6 py-4 space-y-4">
              {/* Description */}
              <p className="text-sm" style={{ color: '#555555' }}>
                {template.descripcion}
              </p>

              {/* Meta Information */}
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#727272' }}>
                    Tipo de Propuesta
                  </p>
                  <p className="text-sm font-medium" style={{ color: '#333333' }}>
                    {template.targetPropuesta.charAt(0).toUpperCase() + template.targetPropuesta.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: '#727272' }}>
                    Subcategoría
                  </p>
                  <p className="text-sm font-medium" style={{ color: '#333333' }}>
                    {template.subcategoria}
                  </p>
                </div>
              </div>

              {/* Structure Preview */}
              <div
                className="border rounded p-3"
                style={{ backgroundColor: '#f9f9f9', borderColor: '#e0e0e0' }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: '#727272' }}>
                  Estructura Fija
                </p>
                <p className="text-xs" style={{ color: '#999999', lineHeight: '1.5' }}>
                  {template.structurePrompt.substring(0, 120)}...
                </p>
              </div>
            </div>

            {/* Card Footer - Action Button */}
            <div className="px-6 py-4 border-t" style={{ borderColor: '#e0e0e0' }}>
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-80"
                style={{ backgroundColor: template.colorBadge }}
              >
                <Sparkles size={18} />
                Usar este Molde
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* INFO SECTION */}
      <div
        className="border rounded-lg p-4"
        style={{
          backgroundColor: '#f0f9ff',
          borderColor: '#7dd3fc',
        }}
      >
        <p className="text-xs" style={{ color: '#0369a1' }}>
          <strong>Cómo funciona:</strong> Al hacer clic en "Usar este Molde", la plantilla se inyectará
          automáticamente en el generador. Selecciona un cliente y continúa con el flujo normal de redacción.
        </p>
      </div>

      {/* TEMPLATES COUNT */}
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: '#727272' }}>
          Total de plantillas disponibles: <span style={{ color: '#18bdc1', fontWeight: 'bold' }}>5 moldes maestros</span>
        </p>
      </div>
    </div>
  );
}
