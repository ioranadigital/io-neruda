'use client';

import React, { useState } from 'react';
import { Template } from '@/src/types/templates';
import {
  Sparkles,
  ArrowRight,
  Scale3d,
  ShoppingCart,
  Wrench,
  MessageCircle,
  Brain,
  Eye,
  EyeOff,
  ChevronDown,
  Trophy,
  TrendingUp,
  BookMarked,
  Star,
  AlertTriangle,
  MapPin,
  Ruler,
  Scroll,
  GitCompare,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ReactNode> = {
  'Scale3d': <Scale3d size={32} />,
  'ShoppingCart': <ShoppingCart size={32} />,
  'Wrench': <Wrench size={32} />,
  'MessageCircle': <MessageCircle size={32} />,
  'Brain': <Brain size={32} />,
  'Trophy': <Trophy size={32} />,
  'TrendingUp': <TrendingUp size={32} />,
  'BookMarked': <BookMarked size={32} />,
  'Star': <Star size={32} />,
  'AlertTriangle': <AlertTriangle size={32} />,
  'MapPin': <MapPin size={32} />,
  'Ruler': <Ruler size={32} />,
  'Scroll': <Scroll size={32} />,
  'GitCompare': <GitCompare size={32} />,
};

interface TemplateGridProps {
  templates: Template[];
  onUseTemplate: (template: Template) => void;
  onPreview?: (template: Template) => void;
  onToggleStep1?: (templateId: string) => void;
  enabledInStep1?: Set<string>;
  gridCols?: string;
}

export function TemplateGrid({
  templates,
  onUseTemplate,
  onPreview,
  onToggleStep1,
  enabledInStep1 = new Set(),
  gridCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}: TemplateGridProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {templates.map((template) => {
        const expanded = expandedIds.has(template.id);
        return (
          <div
            key={template.id}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            style={{ borderColor: '#e0e0e0' }}
          >
            {/* Card Header */}
            <button
              onClick={() => toggleExpand(template.id)}
              className="w-full text-left px-5 py-4 transition-colors"
              style={{ backgroundColor: template.colorBadge + '12' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div style={{ color: template.colorBadge }}>
                  {ICON_MAP[template.icon]}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: template.colorBadge + '20',
                      color: template.colorBadge,
                    }}
                  >
                    {template.categoria}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: template.colorBadge,
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                  />
                </div>
              </div>
              <h2
                className="text-sm font-bold text-left"
                style={{ color: '#333333' }}
              >
                {template.nombre}
              </h2>
              <p
                className="text-xs mt-2 text-left"
                style={{ color: '#666666', lineHeight: '1.5' }}
              >
                {template.descripcion}
              </p>
            </button>

            {/* Expandable content */}
            {expanded && (
              <>
                <div
                  className="px-5 py-4 space-y-4 flex-1"
                  style={{ borderTop: `1px solid ${template.colorBadge}20` }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: '#999999' }}
                      >
                        Tipo de Propuesta
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: '#444444' }}
                      >
                        {template.targetPropuesta.charAt(0).toUpperCase() +
                          template.targetPropuesta.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: '#999999' }}
                      >
                        Subcategoría
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: '#444444' }}
                      >
                        {template.subcategoria}
                      </p>
                    </div>
                  </div>

                  <div
                    className="border rounded-lg p-3"
                    style={{ backgroundColor: '#f9f9f9', borderColor: '#ebebeb' }}
                  >
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{ color: '#999999' }}
                    >
                      Estructura Fija
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: '#aaaaaa', lineHeight: '1.6' }}
                    >
                      {template.structurePrompt.substring(0, 120)}…
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 border-t space-y-2" style={{ borderColor: '#f0f0f0' }}>
                  <div className="flex gap-2">
                    {onPreview && (
                      <button
                        onClick={() => onPreview(template)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-medium"
                        style={{
                          backgroundColor: '#f5f5f5',
                          color: '#666666',
                          border: '1px solid #e8e8e8',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            '#eeeeee';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                            '#f5f5f5';
                        }}
                      >
                        <Eye size={13} />
                        Ver ejemplo
                      </button>
                    )}
                    <button
                      onClick={() => onUseTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 font-semibold rounded-lg transition-all text-xs"
                      style={{
                        backgroundColor: template.colorBadge + '15',
                        color: template.colorBadge,
                        border: `1px solid ${template.colorBadge}40`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          template.colorBadge + '28';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          template.colorBadge + '15';
                      }}
                    >
                      <Sparkles size={13} />
                      Usar este Molde
                      <ArrowRight size={12} />
                    </button>
                  </div>

                  {/* Step 1 Visibility Toggle */}
                  {onToggleStep1 && (
                    <button
                      onClick={() => onToggleStep1(template.id)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg transition-all text-xs font-medium"
                      style={{
                        backgroundColor: enabledInStep1.has(template.id)
                          ? '#f0fdf4'
                          : '#f5f5f5',
                        color: enabledInStep1.has(template.id)
                          ? '#16a34a'
                          : '#666666',
                        border: enabledInStep1.has(template.id)
                          ? '1px solid #bbf7d0'
                          : '1px solid #e8e8e8',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          enabledInStep1.has(template.id) ? '#dcfce7' : '#eeeeee';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          enabledInStep1.has(template.id) ? '#f0fdf4' : '#f5f5f5';
                      }}
                    >
                      {enabledInStep1.has(template.id) ? (
                        <>
                          <Eye size={13} />
                          Visible en Paso 1
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} />
                          Oculta en Paso 1
                        </>
                      )}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
