import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabIntegration({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Integración & Herramientas</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma CRM</label>
          <select
            value={formData.crm_platform || ''}
            onChange={(e) => onChange('crm_platform', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona</option>
            <option value="salesforce">Salesforce</option>
            <option value="hubspot">HubSpot</option>
            <option value="pipedrive">Pipedrive</option>
            <option value="monday">Monday.com</option>
            <option value="custom">Otra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Herramienta Analytics</label>
          <select
            value={formData.analytics_tool || ''}
            onChange={(e) => onChange('analytics_tool', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona</option>
            <option value="ga4">Google Analytics 4</option>
            <option value="mixpanel">Mixpanel</option>
            <option value="amplitude">Amplitude</option>
            <option value="custom">Otra</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plataforma Email</label>
          <select
            value={formData.email_platform || ''}
            onChange={(e) => onChange('email_platform', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona</option>
            <option value="mailchimp">Mailchimp</option>
            <option value="sendgrid">SendGrid</option>
            <option value="klaviyo">Klaviyo</option>
            <option value="custom">Otra</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Integraciones (tags)</label>
        <input
          type="text"
          value={formData.integrations?.join(', ') || ''}
          onChange={(e) => onChange('integrations', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Slack, Zapier, Make, n8n"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Stack tecnológico</label>
        <textarea
          value={formData.tech_stack || ''}
          onChange={(e) => onChange('tech_stack', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Frontend: React, Backend: Node.js, Database: PostgreSQL, Hosting: AWS"
          rows={4}
        />
      </div>
    </div>
  );
}
