import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabAudience({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Audiencia & Mercado</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Público objetivo</label>
          <input
            type="text"
            value={formData.target_audience || ''}
            onChange={(e) => onChange('target_audience', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Agencias digitales, freelancers"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Edad promedio</label>
          <input
            type="number"
            value={formData.avg_age || ''}
            onChange={(e) => onChange('avg_age', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 35"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de ingresos</label>
          <select
            value={formData.income_level || ''}
            onChange={(e) => onChange('income_level', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona</option>
            <option value="low">Bajo</option>
            <option value="medium">Medio</option>
            <option value="high">Alto</option>
            <option value="luxury">Lujo</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Buyer Personas</label>
        <textarea
          value={formData.buyer_personas || ''}
          onChange={(e) => onChange('buyer_personas', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Describe los perfiles principales de tus clientes"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Industrias principales (tags)</label>
        <input
          type="text"
          value={formData.target_industries?.join(', ') || ''}
          onChange={(e) => onChange('target_industries', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Tech, Marketing, Finance"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Propuesta de valor (USP)</label>
        <textarea
          value={formData.unique_proposition || ''}
          onChange={(e) => onChange('unique_proposition', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="¿Qué te hace diferente? ¿Por qué nos eligen?"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Problemas que resuelve (tags)</label>
        <input
          type="text"
          value={formData.problems_solved?.join(', ') || ''}
          onChange={(e) => onChange('problems_solved', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Automatizar procesos, Mejorar ROI"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Caso de éxito / Logro principal</label>
        <textarea
          value={formData.success_case || ''}
          onChange={(e) => onChange('success_case', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Describe un proyecto exitoso o resultado importante"
          rows={3}
        />
      </div>
    </div>
  );
}
