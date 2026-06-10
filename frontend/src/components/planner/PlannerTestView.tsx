'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import { EditorialPiece, MonthlyPlan } from '@/src/types/planner';
import { getMonthlyPlan } from '@/src/data/monthlyPlans';
import { Zap, ChevronRight } from 'lucide-react';

// Loading skeleton component
function PlanSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse"></div>
      ))}
    </div>
  );
}

// Format icon mapper
function getFormatIcon(format: string): string {
  const icons: Record<string, string> = {
    blog: '📝',
    instagram: '📸',
    linkedin: '💼',
    email: '✉️',
    whatsapp: '💬',
    newsletter: '📧',
    pdf: '📄',
  };
  return icons[format] || '📄';
}

// Content type label mapper
function getContentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    guia_completa: 'Guía Completa',
    tips_trucos: 'Tips & Trucos',
    comparativa: 'Comparativa',
    tendencias: 'Tendencias',
    caso_estudio: 'Caso de Estudio',
    tutorial: 'Tutorial',
    solucion_rapida: 'Solución Rápida',
    informe_temporada: 'Informe Temporada',
    errores_comunes: 'Errores Comunes',
    antes_despues: 'Antes & Después',
  };
  return labels[type] || type;
}

interface PlannerTestViewProps {
  onPieceSelect?: (piece: EditorialPiece) => void;
}

export default function PlannerTestView({ onPieceSelect }: PlannerTestViewProps) {
  const router = useRouter();
  const { selectedClient, selectClient, clients } = useGenerator();

  // Local state for planner
  const [currentPlan, setCurrentPlan] = useState<MonthlyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeClientId, setActiveClientId] = useState<string>(selectedClient?.id || '');

  // Generate monthly plan
  const handleGeneratePlan = async () => {
    if (!activeClientId) return;

    setIsLoading(true);
    // Simulate API call with 1.5s delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const plan = getMonthlyPlan(activeClientId);
    setCurrentPlan(plan);
    setIsLoading(false);
  };

  // Bridge function: Inject piece data into GeneratorPanel and navigate
  const handleRedactContent = (piece: EditorialPiece) => {
    // Create injection payload
    const injectionPayload = {
      selectedFormats: { [piece.format]: true },
      keywordsSeleccionadas: [piece.recommendedKeyword],
      propuestaElegida: {
        titulo: piece.title,
        metaTitle: piece.metaTitle,
        metaDescription: piece.metaDescription,
      },
      contentType: piece.contentType,
      subtitle: piece.subtitle,
    };

    // Store in sessionStorage for GeneratorPanel to pick up
    sessionStorage.setItem('planner-injection', JSON.stringify(injectionPayload));
    sessionStorage.setItem('planner-source', 'true');

    // Call optional callback if provided
    if (onPieceSelect) {
      onPieceSelect(piece);
    }

    // Navigate to PASO 6 (SEO/GEO step) in GeneratorPanel
    router.push('/generators?step=6');
  };

  // Handle client selection
  const handleClientChange = (clientId: string) => {
    setActiveClientId(clientId);
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      selectClient(client);
    }
    setCurrentPlan(null); // Reset plan when client changes
  };

  return (
    <div className="w-full space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📅</span>
          <h1 className="text-2xl font-bold" style={{ color: '#333333' }}>
            Planificador Editorial Mensual
          </h1>
          <span
            className="ml-auto text-xs font-bold px-3 py-1 rounded"
            style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
          >
            MODO TEST
          </span>
        </div>
        <p style={{ color: '#727272' }} className="text-sm">
          Genera planes mensuales de contenido en bloque y redacta directamente desde aquí.
        </p>
      </div>

      {/* CLIENT SELECTOR */}
      <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
        <label className="block text-sm font-semibold mb-3" style={{ color: '#333333' }}>
          Selecciona Cliente Activo
        </label>
        <select
          value={activeClientId}
          onChange={(e) => handleClientChange(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ borderColor: '#e0e0e0', color: '#333333' }}
        >
          <option value="">-- Selecciona un cliente --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </div>

      {/* GENERATE BUTTON */}
      {!currentPlan && (
        <button
          onClick={handleGeneratePlan}
          disabled={!activeClientId || isLoading}
          className="w-full px-6 py-4 rounded-lg font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            backgroundColor: activeClientId ? '#4f46e5' : '#d1d5db',
            cursor: activeClientId && !isLoading ? 'pointer' : 'not-allowed',
          }}
        >
          <Zap size={20} />
          {isLoading ? 'Generando Plan...' : 'Generar Plan Mensual (4 Piezas)'}
        </button>
      )}

      {/* LOADING STATE */}
      {isLoading && (
        <div className="bg-white border rounded-lg p-6 shadow-sm" style={{ borderColor: '#e0e0e0' }}>
          <PlanSkeleton />
        </div>
      )}

      {/* PLAN TABLE */}
      {currentPlan && !isLoading && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: '#333333' }}>
              Plan para {currentPlan.clientName}
            </h2>
            <button
              onClick={() => setCurrentPlan(null)}
              className="text-sm font-medium px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
              style={{ borderColor: '#e0e0e0', color: '#555555' }}
            >
              Generar otro
            </button>
          </div>

          <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#e0e0e0' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderColor: '#e0e0e0' }} className="border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: '#727272' }}>
                      Semana
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: '#727272' }}>
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: '#727272' }}>
                      Título
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: '#727272' }}>
                      Keyword
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold" style={{ color: '#727272' }}>
                      Estado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold" style={{ color: '#727272' }}>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody style={{ borderColor: '#e0e0e0' }} className="divide-y">
                  {currentPlan.pieces.map((piece) => (
                    <tr key={piece.id} className="hover:bg-gray-50 transition">
                      {/* Week Badge */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
                        >
                          Semana {piece.week}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{piece.icon}</span>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: '#333333' }}>
                              {getFormatIcon(piece.format)} {piece.format.charAt(0).toUpperCase() + piece.format.slice(1)}
                            </p>
                            <p className="text-xs" style={{ color: '#999999' }}>
                              {getContentTypeLabel(piece.contentType)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#333333' }}>
                            {piece.title}
                          </p>
                          <p className="text-xs" style={{ color: '#999999' }}>
                            {piece.subtitle}
                          </p>
                        </div>
                      </td>

                      {/* Keyword */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-2 py-1 rounded text-xs font-medium"
                          style={{ backgroundColor: '#f3e8ff', color: '#6b21a8' }}
                        >
                          {piece.recommendedKeyword}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-block px-3 py-1 rounded text-xs font-bold"
                          style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                        >
                          💡 Idea / Pendiente
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRedactContent(piece)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-all hover:shadow-lg"
                          style={{ backgroundColor: '#4f46e5' }}
                        >
                          <Zap size={16} />
                          Redactar
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PLAN SUMMARY */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Piezas', value: currentPlan.pieces.length, color: '#3b82f6' },
              { label: 'Formatos', value: new Set(currentPlan.pieces.map((p) => p.format)).size, color: '#8b5cf6' },
              { label: 'Keywords', value: currentPlan.pieces.length, color: '#ec4899' },
              { label: 'Estado', value: 'Listas para redactar', color: '#14b8a6', isText: true },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-4"
                style={{ borderColor: '#e0e0e0' }}
              >
                <p className="text-xs font-semibold mb-2" style={{ color: '#727272' }}>
                  {stat.label}
                </p>
                <p
                  className={`text-2xl font-bold ${stat.isText ? 'text-sm' : ''}`}
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* INFO BOX */}
      <div
        className="border rounded-lg p-4"
        style={{
          backgroundColor: '#f0f9ff',
          borderColor: '#7dd3fc',
        }}
      >
        <p className="text-xs" style={{ color: '#0369a1' }}>
          <strong>💡 Tip:</strong> Al hacer clic en "Redactar", los datos de la pieza se inyectarán directamente en el
          formulario del Paso 6 (SEO/GEO). El cliente ya estará seleccionado y listo para generar contenido con IA.
        </p>
      </div>
    </div>
  );
}
