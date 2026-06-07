import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabContent({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Contenido & Estrategia SEO</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Frecuencia de publicación</label>
          <select
            value={formData.publication_frequency || ''}
            onChange={(e) => onChange('publication_frequency', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona</option>
            <option value="daily">Diario</option>
            <option value="2-3_week">2-3 veces/semana</option>
            <option value="weekly">Semanal</option>
            <option value="bi_weekly">Quincenal</option>
            <option value="monthly">Mensual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Palabras promedio por artículo</label>
          <input
            type="number"
            value={formData.avg_word_count || ''}
            onChange={(e) => onChange('avg_word_count', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1500"
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.tone_varies_by_channel || false}
              onChange={(e) => onChange('tone_varies_by_channel', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">El tono varía según el canal</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords Niche (tags)</label>
        <input
          type="text"
          value={formData.keywords_niche?.join(', ') || ''}
          onChange={(e) => onChange('keywords_niche', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Marketing automation, Email marketing"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords Long-tail (tags)</label>
        <input
          type="text"
          value={formData.keywords_longtail?.join(', ') || ''}
          onChange={(e) => onChange('keywords_longtail', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Cómo elegir herramientas de marketing automation"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content Pillars / Tópicos (tags)</label>
        <input
          type="text"
          value={formData.content_pillars?.join(', ') || ''}
          onChange={(e) => onChange('content_pillars', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Marketing Automation, CRM, Email Marketing"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Palabras prohibidas (tags)</label>
        <input
          type="text"
          value={formData.forbidden_keywords?.join(', ') || ''}
          onChange={(e) => onChange('forbidden_keywords', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., spam, fake, cheap"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas soportados (tags)</label>
        <input
          type="text"
          value={formData.supported_languages?.join(', ') || ''}
          onChange={(e) => onChange('supported_languages', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., es, en, fr"
        />
        <p className="text-xs text-gray-500 mt-1">Códigos ISO separados por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta description template</label>
        <textarea
          value={formData.meta_description_template || ''}
          onChange={(e) => onChange('meta_description_template', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Descubre cómo {{topic}} puede mejorar tu {{benefit}}. {{cta}}"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">Usa (ejemplo: topic, benefit, cta) para variables dinámicas</p>
      </div>
    </div>
  );
}
