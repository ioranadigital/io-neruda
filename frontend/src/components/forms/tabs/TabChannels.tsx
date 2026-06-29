import React from 'react';
import { Client } from '@/src/types/client';

interface TabProps {
  formData: Partial<Client>;
  onChange: (field: string, value: any) => void;
}

export default function TabChannels({ formData, onChange }: TabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Canales & Distribución</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'channel_blog', label: 'Blog' },
          { key: 'channel_email', label: 'Email' },
          { key: 'channel_linkedin', label: 'LinkedIn' },
          { key: 'channel_instagram', label: 'Instagram' },
          { key: 'channel_twitter', label: 'Twitter/X' },
          { key: 'channel_tiktok', label: 'TikTok' },
          { key: 'channel_youtube', label: 'YouTube' },
          { key: 'newsletter_enabled', label: 'Newsletter' },
        ].map(channel => (
          <label key={channel.key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData[channel.key as keyof Client] as boolean || false}
              onChange={(e) => onChange(channel.key, e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">{channel.label}</span>
          </label>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suscriptores newsletter</label>
          <input
            type="number"
            value={formData.newsletter_subscribers || ''}
            onChange={(e) => onChange('newsletter_subscribers', parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Formatos preferidos (tags)</label>
        <input
          type="text"
          value={formData.preferred_formats?.join(', ') || ''}
          onChange={(e) => onChange('preferred_formats', e.target.value.split(',').map(v => v.trim()))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Blog, Infográficos, Videos"
        />
        <p className="text-xs text-gray-500 mt-1">Separadas por comas</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Redes sociales (JSON)</label>
        <textarea
          value={JSON.stringify(formData.social_media_handles || {}, null, 2)}
          onChange={(e) => {
            try {
              onChange('social_media_handles', JSON.parse(e.target.value));
            } catch (err) {
              // silently ignore invalid JSON
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder='{ "instagram": "@brand", "linkedin": "company/brand" }'
          rows={5}
        />
      </div>
    </div>
  );
}
