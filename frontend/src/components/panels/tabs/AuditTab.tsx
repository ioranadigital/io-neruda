'use client';

import React, { useMemo } from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { GenerationResponse } from '@/src/types/aiGeneration';

interface AuditTabProps {
  content: GenerationResponse;
  selectedKeyword: string | null;
  keywordsNiche: string[];
  contentIntent?: string;
}

export default function AuditTab({
  content,
  selectedKeyword,
  keywordsNiche,
  contentIntent,
}: AuditTabProps) {
  const fullContent = useMemo(() => {
    const { content: contentData } = content;
    let result = `${contentData.intro.hook} ${contentData.intro.context} ${contentData.intro.promise}`;
    contentData.sections.forEach((section) => {
      result += ` ${section.h2} ${section.content} ${section.keyTakeaway}`;
    });
    result += ` ${contentData.conclusion} ${contentData.cta}`;
    return result.toLowerCase();
  }, [content]);

  const exclusionTerms = [
    'en conclusión',
    'es crucial',
    'para resumir',
    'finalmente',
    'en resumen',
    'debes saber que',
  ];

  const keywordAnalysis = useMemo(() => {
    if (!selectedKeyword) return [];
    const keyword = selectedKeyword.toLowerCase();
    const count = (fullContent.match(new RegExp(keyword, 'g')) || []).length;
    return [
      {
        keyword,
        found: count > 0,
        count,
        status: count === 0 ? 'no_encontrada' : count >= 2 ? 'optima' : 'minima',
      },
      ...keywordsNiche.map((niche) => {
        const n = niche.toLowerCase();
        const c = (fullContent.match(new RegExp(n, 'g')) || []).length;
        return {
          keyword: n,
          found: c > 0,
          count: c,
          status: c === 0 ? 'no_encontrada' : c >= 2 ? 'optima' : 'minima',
        };
      }),
    ];
  }, [fullContent, selectedKeyword, keywordsNiche]);

  const exclusionAnalysis = useMemo(() => {
    const found = exclusionTerms.filter((term) =>
      fullContent.includes(term.toLowerCase())
    );
    return {
      total: exclusionTerms.length,
      passed: exclusionTerms.length - found.length,
      excluded: found,
      success: found.length === 0,
    };
  }, [fullContent]);

  const eeeatScore = useMemo(() => {
    let score = 50; // Base
    if (keywordAnalysis.some((k) => k.status === 'optima')) score += 20;
    if (exclusionAnalysis.success) score += 20;
    if (contentIntent === 'informative' || contentIntent === 'educational') score += 10;
    return Math.min(100, score);
  }, [keywordAnalysis, exclusionAnalysis, contentIntent]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4">
        {/* Densidad de Keywords */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
            🔑 Densidad de Keywords
          </h4>
          <div className="space-y-2">
            {keywordAnalysis.map((kw, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-slate-700">{kw.keyword}</span>
                <div className="flex items-center gap-2">
                  {kw.found ? (
                    <>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs font-bold">
                        ✓ {kw.count}x
                      </span>
                    </>
                  ) : (
                    <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-mono">
                      No encontrada
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filtro de Exclusiones */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
            ⛔ Filtro de Exclusiones (Nivel 6)
          </h4>
          {exclusionAnalysis.success ? (
            <div className="flex items-start gap-2 text-green-700 text-sm bg-green-50 p-3 rounded">
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Excelente: Sin términos prohibidos</p>
                <p className="text-xs text-green-600">Se detectaron {exclusionAnalysis.total} términos de exclusión y ninguno se usó.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-red-700 text-sm bg-red-50 p-3 rounded">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Advertencia: Se encontraron términos prohibidos</p>
                <p className="text-xs text-red-600 mt-1">
                  {exclusionAnalysis.excluded.join(', ')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* EEAT Score */}
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
            📈 GEO / EEAT Score
          </h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-700">Puntuación de Optimización</span>
                <span className="text-sm font-bold text-indigo-600">{eeeatScore}%</span>
              </div>
              <div className="w-full h-3 bg-slate-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${eeeatScore}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-2">
              🎯 Score basado en: Densidad de keywords ({keywordAnalysis.filter((k) => k.status === 'optima').length} optimizadas),
              ausencia de términos prohibidos ({exclusionAnalysis.success ? '✓' : '✗'}), e intención de contenido.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-indigo-50 px-4 py-2 text-xs text-indigo-900">
        <p>
          💡 Una puntuación superior a 75% indica contenido de alta calidad optimizado para IA y buscadores.
        </p>
      </div>
    </div>
  );
}
