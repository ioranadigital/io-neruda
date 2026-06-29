'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '../../types/client';
import { Download, Copy, Zap } from 'lucide-react';
import { showToast } from '../shared/Toast';

interface InsightSuggestion {
  id: string;
  title: string;
  description: string;
  suggestedKeywords: string[];
  contentPillars: string[];
  intent: 'educational' | 'transactional' | 'social_proof' | 'thought_leadership';
}

interface PlanGeneratorPanelProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

const generateInsights = (client: Client): InsightSuggestion[] => {
  const business = client.business_type || '';
  const audience = client.target_audience || '';
  const pillars = client.content_pillars || [];
  const keywords = client.keywords_niche || [];
  const proposition = client.unique_proposition || '';

  const baseInsights: InsightSuggestion[] = [
    {
      id: '1',
      title: `${proposition ? `${proposition}: ` : ''}Guía Completa para ${audience}`,
      description: `Educational deep-dive sobre cómo ${audience} puede maximizar ${business}. Incluye mejores prácticas, tips, y roadmap.`,
      suggestedKeywords: keywords.slice(0, 3),
      contentPillars: pillars.slice(0, 2),
      intent: 'educational',
    },
    {
      id: '2',
      title: `Tendencias ${new Date().getFullYear()} en ${business}`,
      description: `Análisis de tendencias emergentes. Posiciona a tu marca como thought leader en ${business}. Incluye predicciones y casos de éxito.`,
      suggestedKeywords: [...keywords.slice(0, 2), `tendencias ${business.toLowerCase()}`],
      contentPillars: pillars.slice(0, 2),
      intent: 'thought_leadership',
    },
    {
      id: '3',
      title: `Cómo Elegir ${business}: Comparativa + Recomendaciones`,
      description: `Content comercial que guía al usuario en decisión de compra/contratación. Comparativas vs competencia, beneficios, ROI.`,
      suggestedKeywords: [...keywords, `mejor ${business.toLowerCase()}`],
      contentPillars: pillars.slice(0, 2),
      intent: 'transactional',
    },
    {
      id: '4',
      title: `${client.success_case || `Caso de Éxito: ${audience} Consiguió Resultados Extraordinarios`}`,
      description: `Storytelling + datos. Demuestra valor real con métricas concretas (+X%, $Y). Máximo social proof.`,
      suggestedKeywords: keywords.slice(0, 2),
      contentPillars: pillars.slice(0, 2),
      intent: 'social_proof',
    },
    {
      id: '5',
      title: `${audience}: Errores Comunes a Evitar en ${business}`,
      description: `Educational + Posicionamiento. Identifica pain points comunes, soluciones, y diferenciadores de tu marca.`,
      suggestedKeywords: keywords.slice(0, 3),
      contentPillars: pillars.slice(0, 2),
      intent: 'educational',
    },
  ];

  return baseInsights;
};

export default function PlanGeneratorPanel({
  clients,
  selectedClient,
  onSelectClient,
}: PlanGeneratorPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [insights, setInsights] = useState<InsightSuggestion[]>([]);
  const [selectedInsight, setSelectedInsight] = useState<InsightSuggestion | null>(null);
  const [formData, setFormData] = useState({
    planTitle: '',
    targetKeyword: '',
    secondaryKeywords: '',
    objective: '',
    contentIntent: 'educational' as const,
    tone: 'professional' as const,
    differentiator: '',
    h2Sections: [] as string[],
  });

  const [h2Input, setH2Input] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedClient && mounted) {
      const newInsights = generateInsights(selectedClient);
      setInsights(newInsights);
      setSelectedInsight(null);
      setFormData({
        planTitle: '',
        targetKeyword: '',
        secondaryKeywords: '',
        objective: '',
        contentIntent: 'educational',
        tone: (selectedClient.default_tone as any) || 'professional',
        differentiator: selectedClient.unique_proposition || '',
        h2Sections: [],
      });
    }
  }, [selectedClient, mounted]);

  const handleSelectInsight = (insight: InsightSuggestion) => {
    setSelectedInsight(insight);
    setFormData({
      planTitle: insight.title,
      targetKeyword: insight.suggestedKeywords[0] || '',
      secondaryKeywords: insight.suggestedKeywords.slice(1).join(', '),
      objective: insight.description,
      contentIntent: (insight.intent as any) || 'educational',
      tone: (selectedClient?.default_tone as any) || 'professional',
      differentiator: selectedClient?.unique_proposition || '',
      h2Sections: insight.contentPillars.slice(0, 3),
    });
    showToast.success('✅ Insight seleccionado - Personaliza según necesites');
  };

  const generatePlanMarkdown = () => {
    if (!selectedClient || !formData.planTitle || !formData.targetKeyword) {
      return 'Selecciona un insight para ver el preview...';
    }

    const today = mounted ? new Date().toISOString().split('T')[0] : 'YYYY-MM-DD';

    return `# 📋 Plan de Contenidos: ${formData.planTitle}

**Cliente:** ${selectedClient.name}
**Fecha:** ${today}
**Estado:** Ready for Generation

---

## 🎯 Resumen Ejecutivo

### Objetivo
${formData.objective}

### Métricas
- **Keyword Principal:** "${formData.targetKeyword}"
- **Intención:** ${formData.contentIntent.toUpperCase()}
- **Tono:** ${formData.tone}

### Diferenciador
${formData.differentiator}

---

## 📝 ESTRUCTURA DE CONTENIDO

### Secciones Principales (H2)
${formData.h2Sections.length > 0 ? formData.h2Sections.map((s, i) => `${i + 1}. ${s}`).join('\n') : 'Agregar secciones...'}

### Keywords
- Principal: ${formData.targetKeyword}
${formData.secondaryKeywords ? `- Secundarias: ${formData.secondaryKeywords}` : ''}

---

**Plan generado por:** Plan Generator (Inteligente)
**Status:** ✅ Ready para Content Generator
`;
  };

  const planMarkdown = mounted ? generatePlanMarkdown() : 'Loading...';

  const handleAddSection = () => {
    if (h2Input.trim()) {
      setFormData({
        ...formData,
        h2Sections: [...formData.h2Sections, h2Input.trim()],
      });
      setH2Input('');
    }
  };

  const handleRemoveSection = (idx: number) => {
    setFormData({
      ...formData,
      h2Sections: formData.h2Sections.filter((_, i) => i !== idx),
    });
  };

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(planMarkdown);
    showToast.success('✅ Copiado');
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([planMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `plan-${selectedClient?.slug || 'plan'}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast.success('✅ Descargado');
  };

  if (!mounted) {
    return <div className="w-full h-full flex items-center justify-center text-gray-600">Cargando...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden p-6 gap-4">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center gap-3 mb-3">
          <Zap size={20} style={{ color: '#18bdc1' }} />
          <h2 className="font-bold text-gray-800">Plan Generator Inteligente</h2>
        </div>
        <select
          value={selectedClient?.id || ''}
          onChange={(e) => {
            const client = clients.find(c => c.id === e.target.value);
            if (client) onSelectClient(client);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">Selecciona cliente para ver insights sugeridos</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {selectedClient && insights.length > 0 ? (
        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Left: Insights Suggestions */}
          <div className="w-1/3 flex flex-col bg-white rounded-lg p-4 shadow overflow-hidden">
            <h3 className="font-bold text-sm text-gray-800 mb-3">💡 5 Insights Sugeridos</h3>
            <div className="flex-1 overflow-y-auto space-y-2">
              {insights.map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => handleSelectInsight(insight)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedInsight?.id === insight.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <p className="font-semibold text-xs text-gray-800 line-clamp-2">{insight.title}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{insight.description}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {insight.intent}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle: Form */}
          <div className="w-1/3 flex flex-col bg-white rounded-lg p-4 shadow overflow-y-auto space-y-3">
            <h3 className="font-bold text-sm text-gray-800">Personaliza el Plan</h3>

            <div>
              <label className="text-xs font-semibold text-gray-800">Título</label>
              <input
                type="text"
                value={formData.planTitle}
                onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-800">Keyword Principal</label>
              <input
                type="text"
                value={formData.targetKeyword}
                onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-800">Keywords Secundarias</label>
              <input
                type="text"
                value={formData.secondaryKeywords}
                onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-800">Objetivo</label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mt-1 h-16 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-800">Intención</label>
              <select
                value={formData.contentIntent}
                onChange={(e) => setFormData({ ...formData, contentIntent: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mt-1"
              >
                <option value="educational">Educativo</option>
                <option value="transactional">Transaccional</option>
                <option value="social_proof">Prueba Social</option>
                <option value="thought_leadership">Liderazgo</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-800">Tono</label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mt-1"
              >
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-800">Secciones H2</label>
              <div className="flex gap-2 mt-1 mb-2">
                <input
                  type="text"
                  value={h2Input}
                  onChange={(e) => setH2Input(e.target.value)}
                  placeholder="Nueva sección"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                />
                <button onClick={handleAddSection} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs">
                  +
                </button>
              </div>
              <div className="space-y-1">
                {formData.h2Sections.map((section, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-100 p-2 rounded text-xs">
                    <span>{section}</span>
                    <button onClick={() => handleRemoveSection(idx)} className="text-red-500">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="w-1/3 flex flex-col bg-white rounded-lg p-4 shadow overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-sm text-gray-800">Preview</h3>
              <div className="flex gap-2">
                <button onClick={handleCopyMarkdown} className="p-1.5 hover:bg-gray-100 rounded text-sm">
                  <Copy size={14} />
                </button>
                <button onClick={handleDownloadMarkdown} className="p-1.5 hover:bg-gray-100 rounded text-sm">
                  <Download size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-200">
              <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700">{planMarkdown}</pre>
            </div>
          </div>
        </div>
      ) : selectedClient ? (
        <div className="flex-1 flex items-center justify-center bg-white rounded-lg">
          <p className="text-gray-600">Cargando insights sugeridos...</p>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white rounded-lg">
          <p className="text-gray-600">Selecciona un cliente para comenzar</p>
        </div>
      )}
    </div>
  );
}
