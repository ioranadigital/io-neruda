import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabManagement({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Gestión & Seguimiento</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado del cliente</label>
          <select
            value={formData.client_status || 'active'}
            onChange={(e) => onChange('client_status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Activo</option>
            <option value="paused">En pausa</option>
            <option value="completed">Completado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del contacto</label>
          <input
            type="text"
            value={formData.primary_contact_name || ''}
            onChange={(e) => onChange('primary_contact_name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Juan Pérez"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email del contacto</label>
          <input
            type="email"
            value={formData.primary_contact_email || ''}
            onChange={(e) => onChange('primary_contact_email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio</label>
          <input
            type="date"
            value={formData.start_date || ''}
            onChange={(e) => onChange('start_date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Próxima revisión</label>
          <input
            type="date"
            value={formData.next_review || ''}
            onChange={(e) => onChange('next_review', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Account Manager (ID)</label>
          <input
            type="text"
            value={formData.account_manager_id || ''}
            onChange={(e) => onChange('account_manager_id', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="UUID del account manager"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notas internas</label>
        <textarea
          value={formData.internal_notes || ''}
          onChange={(e) => onChange('internal_notes', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Notas privadas sobre el cliente, proyectos, dudas, etc."
          rows={6}
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Información del sistema:</strong>
        </p>
        <div className="text-xs text-blue-600 mt-2 space-y-1">
          <p>Creado: {formData.created_at ? new Date(formData.created_at).toLocaleString() : 'N/A'}</p>
          <p>Actualizado: {formData.updated_at ? new Date(formData.updated_at).toLocaleString() : 'N/A'}</p>
          <p>ID: {formData.id || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
