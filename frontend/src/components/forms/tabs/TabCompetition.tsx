import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabCompetition({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Competencia & Posicionamiento</h3>

      <div>
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.monitor_competitors || false}
            onChange={(e) => onChange('monitor_competitors', e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm font-medium text-gray-700">Monitorear competidores</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URLs de competidores</label>
        <textarea
          value={formData.competitor_urls?.join('\n') || ''}
          onChange={(e) => onChange('competitor_urls', e.target.value.split('\n').filter(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Una URL por línea"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Posicionamiento en el mercado</label>
        <select
          value={formData.market_positioning || ''}
          onChange={(e) => onChange('market_positioning', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona</option>
          <option value="premium">Premium</option>
          <option value="value">Value</option>
          <option value="budget">Budget</option>
          <option value="luxury">Luxury</option>
          <option value="niche">Nicho</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Ventajas competitivas (tags)</label>
        <input
          type="text"
          value={formData.competitive_advantages?.join(', ') || ''}
          onChange={(e) => onChange('competitive_advantages', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Precio, Calidad, Servicio al cliente"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Diferenciadores clave (tags)</label>
        <input
          type="text"
          value={formData.differentiators?.join(', ') || ''}
          onChange={(e) => onChange('differentiators', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Patente propia, Equipo experto"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>
    </div>
  );
}
