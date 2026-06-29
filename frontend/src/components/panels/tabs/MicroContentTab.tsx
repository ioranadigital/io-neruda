'use client';

import React, { useMemo, useState } from 'react';
import { Copy, Check, Mail, Share2 } from 'lucide-react';
import { GenerationResponse } from '@/src/types/aiGeneration';
import { showToast } from '../../shared/Toast';

interface MicroContentTabProps {
  content: GenerationResponse;
}

export default function MicroContentTab({ content }: MicroContentTabProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const microContent = useMemo(() => {
    const intro = content.content.intro.hook;
    const promise = content.content.intro.promise;

    const newsletter = `📧 ${content.metadata.title}\n\n${intro}\n\n${promise}\n\n→ Lee el artículo completo`;

    const social = `🔥 ${content.metadata.title}\n\n${intro.substring(0, 100)}...\n\n#SEO #Marketing`;

    return { newsletter, social };
  }, [content]);

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

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 bg-white space-y-3">
        {/* Hook para Newsletter */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-600" />
              <h4 className="font-semibold text-slate-900 text-sm">Hook para Newsletter</h4>
            </div>
            <button
              onClick={() => handleCopy(microContent.newsletter, 'newsletter')}
              className="p-2 hover:bg-white rounded transition"
              title="Copiar al portapapeles"
            >
              {copiedKey === 'newsletter' ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} className="text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-wrap break-words bg-white p-3 rounded border border-slate-200 font-mono text-xs leading-relaxed">
            {microContent.newsletter}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            📊 {microContent.newsletter.length} caracteres
          </p>
        </div>

        {/* Post para Redes Sociales */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Share2 size={18} className="text-purple-600" />
              <h4 className="font-semibold text-slate-900 text-sm">Post para Redes (LinkedIn/Instagram)</h4>
            </div>
            <button
              onClick={() => handleCopy(microContent.social, 'social')}
              className="p-2 hover:bg-white rounded transition"
              title="Copiar al portapapeles"
            >
              {copiedKey === 'social' ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <Copy size={18} className="text-slate-400 hover:text-slate-600" />
              )}
            </button>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-wrap break-words bg-white p-3 rounded border border-slate-200 font-mono text-xs leading-relaxed">
            {microContent.social}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            📊 {microContent.social.length} caracteres
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-purple-50 px-4 py-2 text-xs text-purple-900">
        <p>
          💡 Copia estos fragmentos directamente en tus canales de distribución para maximizar alcance.
        </p>
      </div>
    </div>
  );
}
