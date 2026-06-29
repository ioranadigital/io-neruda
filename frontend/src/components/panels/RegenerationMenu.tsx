'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface RegenerationMenuProps {
  isOpen: boolean;
  isGenerating: boolean;
  onSelectOption: (option: string) => void;
  onClose: () => void;
}

const REGENERATION_OPTIONS = [
  { id: 'complete_rewrite', label: 'Reescribir por completo', description: 'Nuevo enfoque y estructura' },
  { id: 'deeper_technical', label: 'Hacerlo más profundo y técnico', description: 'Añade análisis avanzados' },
  { id: 'seasonal_focus', label: 'Cambiar enfoque estacional', description: 'Adapta a temporada actual' },
  { id: 'keyword_density', label: 'Forzar mayor densidad de keywords', description: 'Optimiza para SEO' },
];

export default function RegenerationMenu({
  isOpen,
  isGenerating,
  onSelectOption,
  onClose,
}: RegenerationMenuProps) {
  const [customText, setCustomText] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmitCustom = () => {
    if (customText.trim()) {
      onSelectOption(customText);
      setCustomText('');
    }
  };

  return (
    <div
      ref={menuRef}
      className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm">¿Qué deseas ajustar?</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-700 rounded transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Options */}
      <div className="max-h-64 overflow-y-auto">
        {REGENERATION_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              onSelectOption(option.id);
              setCustomText('');
            }}
            disabled={isGenerating}
            className="w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="font-medium text-sm text-slate-900">{option.label}</p>
            <p className="text-xs text-slate-600 mt-1">{option.description}</p>
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="border-t border-slate-200 p-3 bg-slate-50">
        <label className="text-xs font-semibold text-slate-700 block mb-2">
          O escribe tu instrucción personalizada:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitCustom()}
            placeholder="Ej: Añade comparativas con competencia"
            disabled={isGenerating}
            className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-200"
          />
          <button
            onClick={handleSubmitCustom}
            disabled={!customText.trim() || isGenerating}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-medium rounded transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
