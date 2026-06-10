'use client';

import React, { useState } from 'react';
import { FileText, Search, BarChart3, Smartphone } from 'lucide-react';
import { GenerationResponse } from '@/src/types/aiGeneration';
import ContentTabPanel from './tabs/ContentTabPanel';
import SEOMetadataTab from './tabs/SEOMetadataTab';
import AuditTab from './tabs/AuditTab';
import MicroContentTab from './tabs/MicroContentTab';

interface ContentTabsProps {
  generatedContent: GenerationResponse | null;
  selectedKeyword: string | null;
  selectedClient: string | null;
  keywordsNiche: string[];
  contentIntent?: string;
}

type TabType = 'content' | 'seo' | 'audit' | 'micro';

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: 'content', label: 'Contenido', icon: <FileText size={18} /> },
  { id: 'seo', label: 'Metadatos SEO', icon: <Search size={18} /> },
  { id: 'audit', label: 'Auditoría e IA', icon: <BarChart3 size={18} /> },
  { id: 'micro', label: 'Micro-contenidos', icon: <Smartphone size={18} /> },
];

export default function ContentTabs({
  generatedContent,
  selectedKeyword,
  selectedClient,
  keywordsNiche,
  contentIntent,
}: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content');

  if (!generatedContent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No hay contenido generado</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className="flex gap-1 px-4 py-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === 'content' && (
          <ContentTabPanel content={generatedContent} />
        )}
        {activeTab === 'seo' && (
          <SEOMetadataTab content={generatedContent} clientName={selectedClient} />
        )}
        {activeTab === 'audit' && (
          <AuditTab
            content={generatedContent}
            selectedKeyword={selectedKeyword}
            keywordsNiche={keywordsNiche}
            contentIntent={contentIntent}
          />
        )}
        {activeTab === 'micro' && (
          <MicroContentTab content={generatedContent} />
        )}
      </div>
    </div>
  );
}
