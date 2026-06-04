'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Content {
  id: string;
  filename: string;
  title: string;
  stage: string;
  word_count: number;
  created_at: string;
}

interface Stage {
  name: string;
  label: string;
  color: string;
}

const STAGES: Record<string, Stage> = {
  insight: { name: 'insight', label: '01-Insights', color: 'blue' },
  plan: { name: 'plan', label: '02-Plans', color: 'yellow' },
  ready: { name: 'ready', label: '03-Ready', color: 'green' },
};

export default function PipelineStages({ projectName }: { projectName: string }) {
  const [contents, setContents] = useState<Record<string, Content[]>>({
    insight: [],
    plan: [],
    ready: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContents() {
      try {
        const data = await api.listContents({ project: projectName });
        const grouped = {
          insight: data.filter((c: Content) => c.stage === 'insight'),
          plan: data.filter((c: Content) => c.stage === 'plan'),
          ready: data.filter((c: Content) => c.stage === 'ready'),
        };
        setContents(grouped);
      } catch (err) {
        console.error('Error fetching contents:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContents();
  }, [projectName]);

  if (loading) {
    return <div className="text-center py-12">Cargando pipeline...</div>;
  }

  return (
    <div className="fade-in grid grid-cols-3 gap-6">
      {Object.entries(STAGES).map(([stageKey, stage]) => (
        <div
          key={stageKey}
          className={`bg-${stage.color}-900 border-2 border-${stage.color}-700 rounded-lg p-6`}
        >
          <h2 className="font-bold text-lg mb-4 text-zinc-100">{stage.label}</h2>
          <div className="space-y-3">
            {contents[stageKey].length === 0 ? (
              <p className="text-zinc-500 text-sm italic">Sin contenidos</p>
            ) : (
              contents[stageKey].map((content) => (
                <div
                  key={content.id}
                  className="bg-zinc-800 border border-zinc-700 rounded p-3 hover:border-zinc-600 transition cursor-pointer"
                >
                  <p className="font-medium text-zinc-100 truncate">{content.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">{content.filename}</p>
                  <p className="text-xs text-zinc-500 mt-2">{content.word_count} palabras</p>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
