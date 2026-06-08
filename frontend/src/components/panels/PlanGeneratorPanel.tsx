'use client';

import React, { useState } from 'react';
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
  const [previewMode, setPreviewMode] = useState(false);

  // Generar plan en markdown
  const generatePlanMarkdown = () => {
    if (!selectedClient || !formData.planTitle || !formData.targetKeyword) {
      showToast.error('Completa: Cliente, Título y Keyword');
      return '';
    }

    const secondaryKeywordsArray = formData.secondaryKeywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    const markdown = `# 📋 Plan de Contenidos: ${formData.planTitle}

**Generado por:** Plan Generator
**Cliente:** ${selectedClient.name}
**Fecha:** ${new Date().toISOString().split('T')[0]}
**Estado:** Ready for Generation

---

## 🎯 Resumen Ejecutivo

### Objetivo
${formData.objective}

### Métricas Objetivo
- **Keyword Principal:** "${formData.targetKeyword}"
- **Keywords Secundarias:** ${secondaryKeywordsArray.map(k => `"${k}"`).join(', ')}
- **Intención:** ${formData.contentIntent.toUpperCase()}
- **Tono:** ${formData.tone}

### Diferenciador
${formData.differentiator}

---

## 📝 ESQUEMA: Blog Post Completo

### Metadatos SEO
\`\`\`
Title: "${formData.planTitle} | ${selectedClient.name}"
Meta Description: "${formData.objective}"
Target Keyword: ${formData.targetKeyword}
Secondary Keywords: ${secondaryKeywordsArray.join(', ')}
\`\`\`

### Estructura de Contenido (H2 - H3)

${formData.h2Sections.map((section, idx) => {
  return `#### ${idx + 1}. **${section} (H2)**

**Descripción:** Sección sobre ${section}

**Sub-secciones (H3):**
- Punto clave 1
- Punto clave 2
- Punto clave 3

---`;
}).join('\n')}

## 📱 Ideas: Posts de LinkedIn

### Idea 1: El Problema
**Duración:** 250 palabras
**Tono:** ${formData.tone}
**Engagement:** Storytelling

\`\`\`
[LinkedIn post sobre el problema que resuelve este contenido]
\`\`\`

---

### Idea 2: El Diferenciador
**Duración:** 280 palabras
**Tono:** Aspiracional

\`\`\`
[LinkedIn post sobre el diferenciador]
\`\`\`

---

## 📊 Matriz de Distribución

| Canal | Contenido | Frecuencia | Timing |
|-------|-----------|-----------|--------|
| Blog | Blog Post | 1/mes | Martes 10am |
| LinkedIn | 2 Posts | 2/mes | Lunes-Miércoles |
| Email | Newsletter | 1/mes | Jueves 5pm |

---

## 🎯 Métricas de Éxito

**Blog Post:**
- Target: 200 visitantes en 30 días
- Objetivo: 5-10 leads
- Ranking target: Top 5 para "\${formData.targetKeyword}"

**LinkedIn:**
- Target: 30-50 reacciones por post
- Objetivo: 3-5 mensajes de consulta

---

## 📅 Siguiente Paso

**Acción:** Enviar a Content Generator para generar contenidos
**Responsable:** Content Generator (${selectedClient.name})
**Tiempo estimado:** 2-4 horas
**Entrega:** ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

---

**Plan generado por:** Plan Generator
**Status:** ✅ Ready para Content Generator
**Cliente:** ${selectedClient.name}
`;

    return markdown;
  };

  const planMarkdown = generatePlanMarkdown();

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
    showToast.success('✅ Plan copiado al portapapeles');
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([planMarkdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `plan-${selectedClient?.slug || 'plan'}-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast.success('✅ Plan descargado');
  };

  return (
    <div className="w-full h-full flex gap-6 overflow-hidden p-6">
      {/* Left Panel: Form */}
      <div className="w-1/2 flex flex-col overflow-y-auto space-y-6 bg-white rounded-lg p-6 shadow">
        {/* Cliente */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Cliente</label>
          <select
            value={selectedClient?.id || ''}
            onChange={(e) => {
              const client = clients.find(c => c.id === e.target.value);
              if (client) onSelectClient(client);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un cliente</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Título del Plan</label>
          <input
            type="text"
            value={formData.planTitle}
            onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
            placeholder="Ej: Auditoría SEO Técnica Guadalajara"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Keyword Principal</label>
          <input
            type="text"
            value={formData.targetKeyword}
            onChange={(e) => setFormData({ ...formData, targetKeyword: e.target.value })}
            placeholder="Ej: auditoría seo técnica"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Keywords Secundarias (separadas por coma)</label>
          <input
            type="text"
            value={formData.secondaryKeywords}
            onChange={(e) => setFormData({ ...formData, secondaryKeywords: e.target.value })}
            placeholder="Ej: seo técnico, core web vitals, velocidad web"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
          />
        </div>

        {/* Objetivo */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Objetivo del Contenido</label>
          <textarea
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            placeholder="¿Qué quieres lograr con este contenido?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 h-20 resize-none"
          />
        </div>

        {/* Intención */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Intención</label>
          <select
            value={formData.contentIntent}
            onChange={(e) => setFormData({ ...formData, contentIntent: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
          >
            <option value="educational">📚 Educativo</option>
            <option value="transactional">🛒 Transaccional</option>
            <option value="social_proof">✅ Prueba Social</option>
            <option value="thought_leadership">🎯 Liderazgo</option>
          </select>
        </div>

        {/* Tono */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Tono</label>
          <select
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        {/* Diferenciador */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Diferenciador / Caso de Éxito</label>
          <textarea
            value={formData.differentiator}
            onChange={(e) => setFormData({ ...formData, differentiator: e.target.value })}
            placeholder="¿Qué te hace diferente? Ej: +156% tráfico en 3 meses"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 h-20 resize-none"
          />
        </div>

        {/* H2 Sections */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Secciones H2 (Estructura)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={h2Input}
              onChange={(e) => setH2Input(e.target.value)}
              placeholder="Ej: Qué es una auditoría SEO"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
            />
            <button
              onClick={handleAddSection}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <div className="space-y-2">
            {formData.h2Sections.map((section, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-sm">{idx + 1}. {section}</span>
                <button
                  onClick={() => handleRemoveSection(idx)}
                  className="text-red-500 hover:text-red-700 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-1/2 flex flex-col bg-white rounded-lg p-6 shadow overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Eye size={16} /> Preview
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Copiar"
            >
              <Copy size={16} />
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Descargar"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 prose prose-sm max-w-none">
          <pre className="text-xs whitespace-pre-wrap font-mono text-gray-700">
            {planMarkdown || 'Completa el formulario para ver el preview...'}
          </pre>
        </div>
      </div>
    </div>
  );
}
