'use client';

import { GenerationResponse } from '@/src/types/aiGeneration';

interface ContentTabPanelProps {
  content: GenerationResponse;
}

export default function ContentTabPanel({ content }: ContentTabPanelProps) {
  const buildContent = (): string => {
    try {
      const { metadata, content: contentData } = content;
      let result = `# ${metadata.title}\n\n`;
      result += `${contentData.intro.hook}\n\n`;
      result += `${contentData.intro.context}\n\n`;
      result += `${contentData.intro.promise}\n\n`;

      contentData.sections.forEach((section) => {
        result += `## ${section.h2}\n\n`;
        result += `${section.content}\n\n`;
        result += `**Key Takeaway:** ${section.keyTakeaway}\n\n`;
      });

      result += `## Conclusión\n\n${contentData.conclusion}\n\n`;
      result += `${contentData.cta}\n\n`;

      return result;
    } catch (e) {
      return 'Error al construir el contenido';
    }
  };

  const mainContent = buildContent();

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        <div className="text-slate-700 whitespace-pre-wrap break-words text-sm leading-relaxed font-mono">
          {mainContent}
        </div>
      </div>

      {/* Footer de estadísticas */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-xs text-slate-600">
          <strong>{mainContent.length}</strong> caracteres | <strong>{mainContent.split(/\s+/).length}</strong> palabras
        </p>
      </div>
    </div>
  );
}
