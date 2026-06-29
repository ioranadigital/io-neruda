import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabMetrics({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Métricas & KPIs</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo principal</label>
        <textarea
          value={formData.main_objective || ''}
          onChange={(e) => onChange('main_objective', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Qué queremos lograr con el contenido"
          rows={3}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">KPI principal</label>
          <input
            type="text"
            value={formData.main_kpi || ''}
            onChange={(e) => onChange('main_kpi', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Traffic mensual, Conversiones"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Meta de conversión</label>
          <input
            type="text"
            value={formData.conversion_goal || ''}
            onChange={(e) => onChange('conversion_goal', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1000 conversiones/mes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto mensual (EUR)</label>
          <input
            type="number"
            value={formData.monthly_budget || ''}
            onChange={(e) => onChange('monthly_budget', parseFloat(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño del equipo</label>
          <input
            type="number"
            value={formData.team_size || ''}
            onChange={(e) => onChange('team_size', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 3"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timeline / Plazo del proyecto</label>
        <input
          type="text"
          value={formData.project_timeline || ''}
          onChange={(e) => onChange('project_timeline', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 6 meses, Q2 2024"
        />
      </div>
    </div>
  );
}
