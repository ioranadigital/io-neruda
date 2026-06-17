'use client';

import React from 'react';
import { Client } from '@/src/types/client';
import ClientSchemaView from '@/src/components/clients/ClientSchemaView';
import KeywordsImportExport from '@/src/components/shared/KeywordsImportExport';

interface TabKeywordsProps {
  formData: Partial<Client>;
  onChange: (field: string, value: unknown) => void;
}

export default function TabKeywords({ formData, onChange }: TabKeywordsProps) {
  const handleImportKeywords = (keywordsData: Record<string, string[]>) => {
    // Map imported data to keywords_hierarchical structure
    const hierarchical = formData.keywords_hierarchical || {};

    Object.entries(keywordsData).forEach(([key, keywords]) => {
      hierarchical[key as any] = keywords;
    });

    onChange('keywords_hierarchical', hierarchical);
  };

  return (
    <div className="space-y-4">
      <KeywordsImportExport
        clientName={formData.name || 'Cliente'}
        onImport={handleImportKeywords}
      />
      <ClientSchemaView formData={formData} onChange={onChange} />
    </div>
  );
}
