'use client';

import React, { useCallback } from 'react';
import ContentResultsPanel from '@/src/components/panels/ContentResultsPanel';
import { useGenerator } from '@/src/context/GeneratorContext';
import { ContentResult } from '@/src/types/generator';

export default function ContenidosPage() {
  const { contentResults, clients, setContentResults } = useGenerator();

  const handleDeleteResult = useCallback((resultId: string) => {
    const updatedResults = contentResults.filter(r => r.id !== resultId);
    setContentResults(updatedResults);
  }, [contentResults, setContentResults]);

  const handleStatusChange = useCallback((resultId: string, status: 'draft' | 'published' | 'archived') => {
    const updatedResults = contentResults.map(r =>
      r.id === resultId ? { ...r, status } : r
    );
    setContentResults(updatedResults);
  }, [contentResults, setContentResults]);

  const handleDuplicateResult = useCallback((result: ContentResult) => {
    const newResult = {
      ...result,
      id: `result_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
    setContentResults([newResult, ...contentResults]);
  }, [contentResults, setContentResults]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contenidos</h1>
        <p className="text-gray-600 mt-2">Visualiza y gestiona todos los contenidos generados por cliente</p>
      </div>

      <div className="flex-1 overflow-auto">
        <ContentResultsPanel
          contentResults={contentResults}
          clients={clients}
          onDeleteResult={handleDeleteResult}
          onStatusChange={handleStatusChange}
          onDuplicateResult={handleDuplicateResult}
        />
      </div>
    </div>
  );
}
