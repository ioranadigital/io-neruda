'use client';

import React from 'react';

interface ToneSelectorProps {
  selectedTone: 'professional' | 'friendly' | 'technical' | 'custom';
  onChange: (tone: 'professional' | 'friendly' | 'technical' | 'custom') => void;
}

const TONES = {
  professional: {
    name: 'Professional',
    description: 'Formal, corporate vocabulary with complex structure',
  },
  friendly: {
    name: 'Friendly',
    description: 'Casual, conversational with simple structure',
  },
  technical: {
    name: 'Technical',
    description: 'Precise, specialized with step-by-step structure',
  },
  custom: {
    name: 'Custom',
    description: 'Provide your own tone guidelines',
  },
};

export default function ToneSelector({ selectedTone, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Tone
      </label>
      <div className="space-y-2">
        {Object.entries(TONES).map(([key, info]) => (
          <label
            key={key}
            className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition"
          >
            <input
              type="radio"
              name="tone"
              value={key}
              checked={selectedTone === key}
              onChange={() => onChange(key as any)}
              className="w-5 h-5"
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
