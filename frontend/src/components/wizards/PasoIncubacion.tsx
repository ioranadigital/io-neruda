'use client';

import React from 'react';
import { Client } from '@/src/types/client';
import { ChevronRight, Lightbulb, TrendingUp, BookOpen, Zap, Trophy, Target } from 'lucide-react';
import { generarPropuestasIncubacion, generarSlug } from '@/src/data/incubacionPropuestas';
import StepContainer from './StepContainer';

interface PasoIncubacionProps {
  selectedClient: Client | null;
  formData: {
    propuestaElegida: string | null;
    seoH1?: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  onChange: (data: {
    propuestaElegida?: string | null;
    seoH1?: string;
    seoH2?: string;
    seoSlug?: string;
    metaTitle?: string;
    metaDescription?: string;
  }) => void;
}

export default function PasoIncubacion({
  selectedClient,
  formData,
  onChange,
}: PasoIncubacionProps) {
  if (!selectedClient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecciona un cliente primero</p>
      </div>
    );
  }

  // Generar propuestas dinámicas según el cliente
  const propuestas = generarPropuestasIncubacion(selectedClient);

  const handleSelectPropuesta = (propuestaId: string) => {
    const propuesta = propuestas.find((p) => p.id === propuestaId);
    if (!propuesta) return;

    const slug = generarSlug(propuesta.titulo);

    onChange({
      propuestaElegida: propuestaId,
      seoH1: propuesta.titulo,
      seoH2: propuesta.puntosClave[0], // Primer punto clave como H2 sugerido
      seoSlug: slug,
      metaTitle: propuesta.metaTitle,
      metaDescription: propuesta.metaDescription,
    });
  };

  return (
    <StepContainer
      title="Incubación de Contenido"
      icon={Lightbulb}
      iconColor="green"
      columns={1}
      gap="medium"
    >

      {/* Grid de 6 Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
        {propuestas.map((propuesta) => {
          const isSelected = formData.propuestaElegida === propuesta.id;

          // Mapeo de colores e iconos por propuesta
          const colorMap: Record<string, { accentColor: string; IconComponent: any }> = {
            newsjacking: { accentColor: 'blue', IconComponent: TrendingUp },
            tutorial: { accentColor: 'green', IconComponent: BookOpen },
            hot_take: { accentColor: 'purple', IconComponent: Zap },
            case_study: { accentColor: 'orange', IconComponent: Trophy },
            commercial: { accentColor: 'red', IconComponent: Target },
          };

          const colors = colorMap[propuesta.id] || colorMap.newsjacking;
          const IconComponent = colors.IconComponent;

          return (
            <button
              key={propuesta.id}
              onClick={() => handleSelectPropuesta(propuesta.id)}
              className={`relative text-left rounded-xl p-6 transition-all duration-300 border bg-white ${
                isSelected
                  ? 'border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Badge */}
              <div className="inline-block mb-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                  colors.accentColor === 'blue'
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : colors.accentColor === 'green'
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : colors.accentColor === 'purple'
                    ? 'bg-purple-100 text-purple-700 border-purple-300'
                    : colors.accentColor === 'orange'
                    ? 'bg-orange-100 text-orange-700 border-orange-300'
                    : 'bg-red-100 text-red-700 border-red-300'
                }`}>
                  <IconComponent className="w-4 h-4" />
                  <span>{propuesta.badge}</span>
                </div>
              </div>

              {/* H1 Sugerido */}
              <div className={`mb-3 p-2.5 rounded-lg border ${
                colors.accentColor === 'blue'
                  ? 'bg-blue-50 border-blue-200'
                  : colors.accentColor === 'green'
                  ? 'bg-green-50 border-green-200'
                  : colors.accentColor === 'purple'
                  ? 'bg-purple-50 border-purple-200'
                  : colors.accentColor === 'orange'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">H1</p>
                <p className="text-sm text-slate-900 font-semibold line-clamp-3 leading-snug">
                  {propuesta.titulo}
                </p>
              </div>

              {/* H2 Propuesto */}
              <div className={`mb-3 p-2.5 rounded-lg border ${
                colors.accentColor === 'blue'
                  ? 'bg-blue-50 border-blue-200'
                  : colors.accentColor === 'green'
                  ? 'bg-green-50 border-green-200'
                  : colors.accentColor === 'purple'
                  ? 'bg-purple-50 border-purple-200'
                  : colors.accentColor === 'orange'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">H2 Propuesto</p>
                <p className="text-xs text-slate-900 font-semibold line-clamp-2 leading-snug">
                  {propuesta.puntosClave[0]}
                </p>
              </div>

              {/* Meta Title Preview */}
              <div className={`mb-3 p-2 rounded-lg border ${
                colors.accentColor === 'blue'
                  ? 'bg-blue-50 border-blue-200'
                  : colors.accentColor === 'green'
                  ? 'bg-green-50 border-green-200'
                  : colors.accentColor === 'purple'
                  ? 'bg-purple-50 border-purple-200'
                  : colors.accentColor === 'orange'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Meta Title</p>
                <p className="text-[11px] text-slate-900 font-semibold line-clamp-1 leading-snug">
                  {propuesta.metaTitle}
                </p>
                <p className="text-[9px] text-slate-600">{propuesta.metaTitle.length} car.</p>
              </div>

              {/* Meta Description Preview */}
              <div className={`mb-3 p-2 rounded-lg border ${
                colors.accentColor === 'blue'
                  ? 'bg-blue-50 border-blue-200'
                  : colors.accentColor === 'green'
                  ? 'bg-green-50 border-green-200'
                  : colors.accentColor === 'purple'
                  ? 'bg-purple-50 border-purple-200'
                  : colors.accentColor === 'orange'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Meta Description</p>
                <p className="text-[11px] text-slate-900 line-clamp-2 leading-tight">
                  {propuesta.metaDescription}
                </p>
                <p className="text-[9px] text-slate-600">{propuesta.metaDescription.length} car. (150-160)</p>
              </div>

              {/* Puntos Clave */}
              <div className="mb-3">
                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">Puntos Clave</p>
                <ul className="space-y-1">
                  {propuesta.puntosClave.map((punto, idx) => (
                    <li key={idx} className="flex gap-1.5 text-[11px] text-slate-700 leading-tight">
                      <span className={`font-bold flex-shrink-0 ${
                        colors.accentColor === 'blue'
                          ? 'text-blue-600'
                          : colors.accentColor === 'green'
                          ? 'text-green-600'
                          : colors.accentColor === 'purple'
                          ? 'text-purple-600'
                          : colors.accentColor === 'orange'
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}>•</span>
                      <span>{punto}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Selector Visual */}
              <div className={`flex items-center justify-end gap-2 mt-4 pt-3 border-t ${
                colors.accentColor === 'blue'
                  ? 'border-blue-200'
                  : colors.accentColor === 'green'
                  ? 'border-green-200'
                  : colors.accentColor === 'purple'
                  ? 'border-purple-200'
                  : colors.accentColor === 'orange'
                  ? 'border-orange-200'
                  : 'border-red-200'
              }`}>
                {isSelected && (
                  <span className={`text-xs font-bold uppercase tracking-wide transition-colors ${
                    colors.accentColor === 'blue'
                      ? 'text-blue-600'
                      : colors.accentColor === 'green'
                      ? 'text-green-600'
                      : colors.accentColor === 'purple'
                      ? 'text-purple-600'
                      : colors.accentColor === 'orange'
                      ? 'text-orange-600'
                      : 'text-red-600'
                  }`}>
                    ✓ Seleccionado
                  </span>
                )}
                {!isSelected && (
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Seleccionar
                  </span>
                )}
                {isSelected && (
                  <ChevronRight
                    size={18}
                    className={`transition-all ${
                      colors.accentColor === 'blue'
                        ? 'text-blue-600'
                        : colors.accentColor === 'green'
                        ? 'text-green-600'
                        : colors.accentColor === 'purple'
                        ? 'text-purple-600'
                        : colors.accentColor === 'orange'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}
                  />
                )}
              </div>

              {/* Indicador Activo */}
              {isSelected && (
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Info Panel */}
      {formData.propuestaElegida && (
        <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4 mt-4">
          <p className="text-green-300 text-sm flex items-center gap-2">
            <span className="text-lg">✅</span>
            <strong>Enfoque seleccionado.</strong> Tus datos se han inyectado en el siguiente paso SEO/GEO.
          </p>
        </div>
      )}
    </StepContainer>
  );
}
