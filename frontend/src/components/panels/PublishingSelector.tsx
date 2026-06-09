'use client';

import React from 'react';
import { Linkedin, Globe, Check } from 'lucide-react';

interface PublishingOption {
  platform: 'linkedin' | 'wordpress';
  label: string;
  icon: React.ReactNode;
  connected: boolean;
}

interface PublishingSelectorProps {
  clientId: string;
  platforms: PublishingOption[];
  selectedPlatforms: ('linkedin' | 'wordpress')[];
  onToggle: (platform: 'linkedin' | 'wordpress') => void;
  disabled?: boolean;
}

export default function PublishingSelector({
  clientId,
  platforms,
  selectedPlatforms,
  onToggle,
  disabled = false,
}: PublishingSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-600 uppercase">Publicar en:</p>
      <div className="flex gap-2 flex-wrap">
        {platforms.map((platform) => (
          <button
            key={platform.platform}
            onClick={() => onToggle(platform.platform)}
            disabled={!platform.connected || disabled}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              selectedPlatforms.includes(platform.platform)
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : platform.connected
                ? 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
          >
            {platform.icon}
            {platform.label}
            {selectedPlatforms.includes(platform.platform) && (
              <Check size={16} className="ml-1" />
            )}
          </button>
        ))}
      </div>
      {platforms.every(p => !p.connected) && (
        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded">
          ⚠️ No hay plataformas de publicación conectadas. Configúralas en la ficha del cliente.
        </p>
      )}
    </div>
  );
}
