import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabReferences({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Referencias & Contexto</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sitios de referencia / inspiración</label>
        <textarea
          value={formData.reference_sites?.join('\n') || ''}
          onChange={(e) => onChange('reference_sites', e.target.value.split('\n').filter(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Una URL por línea"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Competidores a estudiar</label>
        <textarea
          value={formData.competitor_study_urls?.join('\n') || ''}
          onChange={(e) => onChange('competitor_study_urls', e.target.value.split('\n').filter(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Una URL por línea"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ejemplos de contenido exitoso</label>
        <textarea
          value={formData.successful_content_urls?.join('\n') || ''}
          onChange={(e) => onChange('successful_content_urls', e.target.value.split('\n').filter(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Una URL por línea"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recursos útiles</label>
        <textarea
          value={formData.resources_urls?.join('\n') || ''}
          onChange={(e) => onChange('resources_urls', e.target.value.split('\n').filter(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Una URL por línea"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Documentación interna</label>
        <input
          type="url"
          value={formData.internal_docs_url || ''}
          onChange={(e) => onChange('internal_docs_url', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Link a Google Drive, Notion, etc."
        />
      </div>
    </div>
  );
}
