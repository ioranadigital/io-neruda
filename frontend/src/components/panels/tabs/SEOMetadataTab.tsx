'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { GenerationResponse } from '@/src/types/aiGeneration';
import { showToast } from '../../shared/Toast';

interface SEOMetadataTabProps {
  content: GenerationResponse;
  clientName: string | null;
}

interface MetadataItem {
  label: string;
  value: string;
  maxLength: number;
  key: 'h1' | 'metaTitle' | 'metaDescription' | 'slug';
}

export default function SEOMetadataTab({ content, clientName }: SEOMetadataTabProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const slug = (clientName?.toLowerCase().replace(/\s+/g, '-') || 'articulo') + '-' +
    (content.metadata.title.toLowerCase().replace(/\s+/g, '-').substring(0, 40));

  const metadata: MetadataItem[] = [
    {
      label: 'H1 (Título Principal)',
      value: content.metadata.title,
      maxLength: 60,
      key: 'h1',
    },
    {
      label: 'Meta Title (Navegador)',
      value: content.metadata.title.substring(0, 60),
      maxLength: 60,
      key: 'metaTitle',
    },
    {
      label: 'Meta Description (Buscador)',
      value: content.metadata.metaDescription || content.metadata.title.substring(0, 155),
      maxLength: 160,
      key: 'metaDescription',
    },
    {
      label: 'URL Slug',
      value: slug,
      maxLength: 100,
      key: 'slug',
    },
  ];

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      showToast.success('Copiado al portapapeles');
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      showToast.error('Error al copiar');
    }
  };

  const getCharacterStatus = (value: string, maxLength: number) => {
    const length = value.length;
    if (length > maxLength) {
      return { color: 'text-red-600', status: `${length} / ${maxLength}` };
    } else if (length >= maxLength * 0.8) {
      return { color: 'text-yellow-600', status: `${length} / ${maxLength}` };
    }
    return { color: 'text-green-600', status: `${length} / ${maxLength}` };
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 bg-white space-y-3">
        {metadata.map((item) => {
          const charStatus = getCharacterStatus(item.value, item.maxLength);
          return (
            <div
              key={item.key}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{item.label}</h4>
                  <p className={`text-xs ${charStatus.color} font-medium`}>
                    {charStatus.status}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(item.value, item.key)}
                  className="p-2 hover:bg-white rounded transition flex items-center gap-1"
                  title="Copiar al portapapeles"
                >
                  {copiedKey === item.key ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} className="text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-sm text-slate-700 break-words font-mono bg-white p-2 rounded border border-slate-200">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-blue-50 px-4 py-2 text-xs text-blue-900">
        <p>💡 Ajusta los metadatos según tus preferencias antes de publicar</p>
      </div>
    </div>
  );
}
