'use client';

import React from 'react';
import { EnabledFormats } from '../../types/generator';

interface FormatSelectorProps {
  selectedFormats: EnabledFormats;
  onChange: (formats: EnabledFormats) => void;
}

const FORMAT_INFO = {
  blog: { name: 'Blog Post', description: '1500-2000 words, SEO optimized' },
  email: { name: 'Email', description: '250-350 words with variables' },
  social_linkedin: { name: 'LinkedIn', description: '150-250 words with hooks' },
  social_instagram: { name: 'Instagram', description: '100-150 chars with hashtags' },
  whatsapp: { name: 'WhatsApp', description: '120-140 chars, casual' },
  pdf: { name: 'PDF Report', description: '2-3 pages, professional' },
};

export default function FormatSelector({ selectedFormats, onChange }: FormatSelectorProps) {
  const handleToggle = (format: keyof EnabledFormats) => {
    onChange({
      ...selectedFormats,
      [format]: !selectedFormats[format],
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Output Formats
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(FORMAT_INFO).map(([key, info]) => (
          <label
            key={key}
            className="flex items-start p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
          >
            <input
              type="checkbox"
              checked={selectedFormats[key as keyof EnabledFormats]}
              onChange={() => handleToggle(key as keyof EnabledFormats)}
              className="mt-1 w-5 h-5"
            />
            <div className="ml-3">
              <p className="font-medium text-gray-700">{info.name}</p>
              <p className="text-sm text-gray-500">{info.description}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
