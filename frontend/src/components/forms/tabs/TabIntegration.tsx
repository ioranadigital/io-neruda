import React, { useState } from 'react';
import { Client } from '@/src/types/client';
import { Linkedin, Globe, CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabIntegration({ formData, onChange }: TabProps) {
  const [linkedinExpanded, setLinkedinExpanded] = useState(false);
  const [wordpressExpanded, setWordpressExpanded] = useState(false);

  const handlePublishingToggle = (platform: 'linkedin' | 'wordpress', connected: boolean) => {
    const integrations = formData.publishing_integrations || [];
    const updated = integrations.filter(i => i.platform !== platform);
    if (connected) {
      updated.push({ platform, connected: true });
    }
    onChange('publishing_integrations', updated);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Integración & Herramientas</h3>

      {/* Publishing Integrations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">🚀 Plataformas de Publicación</h4>

        {/* LinkedIn */}
        <div className="mb-4 border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setLinkedinExpanded(!linkedinExpanded)}>
            <div className="flex items-center gap-3">
              <Linkedin size={24} className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">LinkedIn</p>
                <p className="text-xs text-gray-500">Publica contenido en LinkedIn</p>
              </div>
            </div>
            <div>
              {formData.linkedin_connected ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <Circle size={20} className="text-gray-400" />
              )}
            </div>
          </div>

          {linkedinExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.linkedin_connected || false}
                    onChange={(e) => {
                      onChange('linkedin_connected', e.target.checked);
                      handlePublishingToggle('linkedin', e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Conectar LinkedIn</span>
                </label>
              </div>

              {formData.linkedin_connected && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID de Perfil LinkedIn</label>
                  <input
                    type="text"
                    value={formData.linkedin_profile_id || ''}
                    onChange={(e) => onChange('linkedin_profile_id', e.target.value)}
                    placeholder="Ej: 123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Token OAuth se guardará de forma segura</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* WordPress */}
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setWordpressExpanded(!wordpressExpanded)}>
            <div className="flex items-center gap-3">
              <Globe size={24} className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">WordPress</p>
                <p className="text-xs text-gray-500">Publica contenido en WordPress</p>
              </div>
            </div>
            <div>
              {formData.wordpress_connected ? (
                <CheckCircle size={20} className="text-green-600" />
              ) : (
                <Circle size={20} className="text-gray-400" />
              )}
            </div>
          </div>

          {wordpressExpanded && (
            <div className="mt-4 space-y-3 border-t pt-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wordpress_connected || false}
                    onChange={(e) => {
                      onChange('wordpress_connected', e.target.checked);
                      handlePublishingToggle('wordpress', e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Conectar WordPress</span>
                </label>
              </div>

              {formData.wordpress_connected && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL de WordPress</label>
                    <input
                      type="url"
                      value={formData.wordpress_url || ''}
                      onChange={(e) => onChange('wordpress_url', e.target.value)}
                      placeholder="Ej: https://misite.wordpress.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Usuario de WordPress</label>
                    <input
                      type="text"
                      value={formData.wordpress_username || ''}
                      onChange={(e) => onChange('wordpress_username', e.target.value)}
                      placeholder="Ej: admin"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Token API se guardará de forma segura</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

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
