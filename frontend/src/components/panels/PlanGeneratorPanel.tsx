'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '../../types/client';
import { Download, Copy, Eye } from 'lucide-react';
import { showToast } from '../shared/Toast';

interface PlanGeneratorPanelProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

export default function PlanGeneratorPanel({
  clients,
  selectedClient,
  onSelectClient,
}: PlanGeneratorPanelProps) {
  const [mounted, setMounted] = useState(false);
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

  const generatePlanMarkdown = () => {
    if (!selectedClient || !formData.planTitle || !formData.targetKeyword) {
      return 'Completa: Cliente, Título y Keyword para ver el preview...';
    }

    const secondaryKeywordsArray = formData.secondaryKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

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

## 📝 ESQUEMA: Blog Post Completo

### Metadatos SEO
Title: "${formData.planTitle}"
Keywords: ${formData.targetKeyword}${secondaryKeywordsArray.length > 0 ? ', ' + secondaryKeywordsArray.join(', ') : ''}

### Estructura (H2 - H3)

${formData.h2Sections.length > 0 ? formData.h2Sections.map((section, idx) => {
  return `${idx + 1}. ${section}`;
}).join('\n') : '(Sin secciones agregadas)'}

---

**Plan generado por:** Plan Generator
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
    <div className="w-full h-full flex gap-6 overflow-hidden p-6">
      {/* Left: Form */}
      <div className="w-1/2 flex flex-col overflow-y-auto space-y-4 bg-white rounded-lg p-6 shadow">
        <div>
          <label className="text-sm font-semibold text-gray-800">Cliente</label>
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = clients.find(c => c.id === e.target.value);
              if (client) onSelectClient(client);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          >
            <option value="">Selecciona cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Título</label>
          <input
            type="text"
            value={formData.planTitle}
            onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
            placeholder="Título del plan"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Keyword Principal</label>
          <input
            type="text"
            value={formData.targetKeyword}
            onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
            placeholder="Keyword"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Keywords Secundarias</label>
          <input
            type="text"
            value={formData.secondaryKeywords}
            onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
            placeholder="Separadas por coma"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Objetivo</label>
          <textarea
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            placeholder="Objetivo del contenido"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 h-16 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Intención</label>
          <select
            value={formData.contentIntent}
            onChange={(e) => setFormData({ ...formData, contentIntent: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          >
            <option value="educational">Educativo</option>
            <option value="transactional">Transaccional</option>
            <option value="social_proof">Prueba Social</option>
            <option value="thought_leadership">Liderazgo</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Tono</label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Diferenciador</label>
          <textarea
            value={formData.differentiator}
            onChange={(e) => setFormData({ ...formData, differentiator: e.target.value })}
            placeholder="Caso de éxito o diferenciador"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-1 h-16 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-800">Secciones H2</label>
          <div className="flex gap-2 mt-1 mb-2">
            <input
              type="text"
              value={h2Input}
              onChange={(e) => setH2Input(e.target.value)}
              placeholder="Nueva sección"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
            />
            <button onClick={handleAddSection} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm">+</button>
          </div>
          <div className="space-y-1">
            {formData.h2Sections.map((section, idx) => (
              <div key={idx} className="flex justify-between items-center bg-gray-100 p-2 rounded text-sm">
                <span>{section}</span>
                <button onClick={() => handleRemoveSection(idx)} className="text-red-500 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 flex flex-col bg-white rounded-lg p-6 shadow overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 text-sm">Preview</h3>
          <div className="flex gap-2">
            <button onClick={handleCopyMarkdown} className="p-2 hover:bg-gray-100 rounded text-sm">
              <Copy size={14} />
            </button>
            <button onClick={handleDownloadMarkdown} className="p-2 hover:bg-gray-100 rounded text-sm">
              <Download size={14} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded border border-gray-200">
          <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700">{planMarkdown}</pre>
        </div>
      </div>
    </div>
  );
}
