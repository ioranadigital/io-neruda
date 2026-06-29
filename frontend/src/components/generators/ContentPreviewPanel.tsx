'use client';

import { useState } from 'react';
import { GenerationResponse } from '@/src/types/aiGeneration';

interface ContentPreviewPanelProps {
  content: GenerationResponse;
}

type TabType = 'metadata' | 'content' | 'seo' | 'engagement';

export function ContentPreviewPanel({ content }: ContentPreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('metadata');

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'metadata', label: 'Metadata' },
    { id: 'content', label: 'Contenido' },
    { id: 'seo', label: 'SEO' },
    { id: 'engagement', label: 'Engagement' },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="flex border-b border-slate-200 bg-slate-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-h-[500px] overflow-y-auto">
        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Título (Title Tag)</label>
              <p className="mt-1 text-sm text-slate-900">{content.metadata.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {content.metadata.title.length} caracteres (recomendado: ≤60)
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Meta Descripción</label>
              <p className="mt-1 text-sm text-slate-900">{content.metadata.metaDescription}</p>
              <p className="text-xs text-slate-500 mt-1">
                {content.metadata.metaDescription.length} caracteres (recomendado: ≤160)
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">H1 Principal</label>
              <p className="mt-1 text-sm text-slate-900">{content.metadata.h1}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Tiempo de Lectura</label>
                <p className="mt-1 text-sm text-slate-900">{content.metadata.estimatedReadTime} min</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Densidad de Keyword</label>
                <p className="mt-1 text-sm text-slate-900">{content.metadata.keywordDensity}%</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Introducción</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-slate-600">Hook</label>
                  <p className="text-sm text-slate-900 mt-1">{content.content.intro.hook}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Contexto</label>
                  <p className="text-sm text-slate-900 mt-1">{content.content.intro.context}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600">Promesa</label>
                  <p className="text-sm text-slate-900 mt-1">{content.content.intro.promise}</p>
                </div>
              </div>
            </div>

            {content.content.sections.map((section, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-slate-900 mb-2">{section.h2}</h4>
                <p className="text-sm text-slate-900 mb-2 line-clamp-3">{section.content}</p>
                <p className="text-xs text-slate-500 italic">{section.keyTakeaway}</p>
              </div>
            ))}

            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Conclusión</h4>
              <p className="text-sm text-slate-900 mb-3">{content.content.conclusion}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm font-semibold text-blue-900">Call-to-Action</p>
              <p className="text-sm text-blue-800 mt-1">{content.content.cta}</p>
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Posición de Keyword Principal
              </label>
              <p className="mt-1 text-sm text-slate-900 capitalize">
                {content.seo.primaryKeywordPlacement}
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                Keywords Utilizadas
              </label>
              <div className="flex flex-wrap gap-2">
                {content.seo.keywordsUsed.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Legibilidad</label>
              <p className="mt-1 text-sm text-slate-900">{content.seo.readabilityScore}/100</p>
            </div>

            {content.seo.internalLinkSuggestions.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Sugerencias de Links Internos
                </label>
                <ul className="space-y-1">
                  {content.seo.internalLinkSuggestions.map((link, idx) => (
                    <li key={idx} className="text-sm text-slate-600">• {link}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">Sentimiento / Tono</label>
              <p className="mt-1 text-sm text-slate-900 capitalize">{content.engagement.sentimentTone}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Índice de Personalidad</label>
              <p className="mt-1 text-sm text-slate-900">{content.engagement.personalityIndex}%</p>
              <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{ width: `${content.engagement.personalityIndex}%` }}
                />
              </div>
            </div>

            {content.engagement.trustBuilders.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Constructores de Confianza
                </label>
                <ul className="space-y-1">
                  {content.engagement.trustBuilders.map((builder, idx) => (
                    <li key={idx} className="text-sm text-slate-600">• {builder}</li>
                  ))}
                </ul>
              </div>
            )}

            {content.engagement.emotionalTriggers.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Triggers Emocionales
                </label>
                <ul className="space-y-1">
                  {content.engagement.emotionalTriggers.map((trigger, idx) => (
                    <li key={idx} className="text-sm text-slate-600">• {trigger}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
