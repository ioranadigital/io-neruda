import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabIdentity({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Información de Identidad</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del negocio *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., XANELUM"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
          <input
            type="text"
            value={formData.slug || ''}
            onChange={(e) => onChange('slug', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., xanelum"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de negocio</label>
          <select
            value={formData.business_type || ''}
            onChange={(e) => onChange('business_type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona tipo</option>
            <option value="saas">SaaS</option>
            <option value="agency">Agencia Digital</option>
            <option value="ecommerce">E-commerce</option>
            <option value="marketplace">Marketplace</option>
            <option value="service">Servicios</option>
            <option value="product">Producto</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">País/Región</label>
          <input
            type="text"
            value={formData.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., España"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sitio web</label>
          <input
            type="url"
            value={formData.website_url || ''}
            onChange={(e) => onChange('website_url', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="+34 123 456 789"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email de contacto</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción corta</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Breve descripción de la marca"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Descripción larga</label>
        <textarea
          value={formData.long_description || ''}
          onChange={(e) => onChange('long_description', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Descripción detallada con contexto del negocio"
          rows={5}
        />
      </div>
    </div>
  );
}
