import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabBrand({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Marca & Voz</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de marca</label>
          <input
            type="text"
            value={formData.brand_name || ''}
            onChange={(e) => onChange('brand_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline/Lema</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => onChange('tagline', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 'Growth made simple'"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL del logo</label>
          <input
            type="url"
            value={formData.logo_url || ''}
            onChange={(e) => onChange('logo_url', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipografía preferida</label>
          <input
            type="text"
            value={formData.typography || ''}
            onChange={(e) => onChange('typography', e.target.value)}
            placeholder="e.g., Inter, Montserrat"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color primario</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.color_primary || '#3B82F6'}
              onChange={(e) => onChange('color_primary', e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.color_primary || '#3B82F6'}
              onChange={(e) => onChange('color_primary', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color secundario</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.color_secondary || '#10B981'}
              onChange={(e) => onChange('color_secondary', e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.color_secondary || '#10B981'}
              onChange={(e) => onChange('color_secondary', e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tono por defecto</label>
        <select
          value={formData.default_tone || 'professional'}
          onChange={(e) => onChange('default_tone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="professional">💼 Profesional / Corporativo - Líder de opinión, formal y objetivo</option>
          <option value="friendly">🤝 Cercano / Coloquial - Confianza, energía y empatía</option>
          <option value="technical">🎓 Técnico / Académico - Divulgativo y analítico</option>
          <option value="persuasive">🧲 Persuasivo / Comercial - Urgencia, conversión e inspiración</option>
          <option value="creative">⚡ Creativo / Informal - Nostálgico, irreverente y lúdico</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Voice (descripción)</label>
        <textarea
          value={formData.brand_voice || ''}
          onChange={(e) => onChange('brand_voice', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Profesional pero accesible, con humor ligero y toque innovador"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Brand Story / Historia</label>
        <textarea
          value={formData.brand_story || ''}
          onChange={(e) => onChange('brand_story', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Cuenta la historia de tu marca, origen, misión"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Valores de marca (tags)</label>
        <input
          type="text"
          value={formData.brand_values?.join(', ') || ''}
          onChange={(e) => onChange('brand_values', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Innovación, Transparencia, Calidad"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>
    </div>
  );
}
