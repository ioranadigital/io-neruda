'use client';

import React from 'react';

export type Language = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';

export const LANGUAGES: Record<Language, { label: string; code: string; name: string }> = {
  es: { label: '🇪🇸', code: 'ES', name: 'Español' },
  en: { label: '🇬🇧', code: 'EN', name: 'English' },
  pt: { label: '🇵🇹', code: 'PT', name: 'Português' },
  fr: { label: '🇫🇷', code: 'FR', name: 'Français' },
  de: { label: '🇩🇪', code: 'DE', name: 'Deutsch' },
  it: { label: '🇮🇹', code: 'IT', name: 'Italiano' },
};

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="w-full flex flex-col gap-2 pt-3">
      {(Object.entries(LANGUAGES) as [Language, typeof LANGUAGES[Language]][]).map(
        ([langCode, { label, code, name }]) => {
          const isSelected = value === langCode;
          return (
            <button
              key={langCode}
              onClick={() => onChange(langCode)}
              className={`w-full flex flex-row items-center justify-start p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 ${
                isSelected
                  ? 'border-slate-400 bg-slate-100 text-slate-900'
                  : 'border-slate-200 bg-white text-slate-600 opacity-60 hover:opacity-100'
              }`}
            >
              <span className="text-xl flex-shrink-0">{label}</span>
              <span className="text-sm font-bold text-slate-900">{code}</span>
              <span className="text-xs text-slate-500 tracking-wide">{name}</span>
            </button>
          );
        }
      )}
    </div>
  );
}
