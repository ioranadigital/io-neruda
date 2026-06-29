'use client';

import React, { ReactNode, useState } from 'react';

interface Tab {
  label: string;
  icon?: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
  onChange?: (index: number) => void;
}

export function Tabs({ tabs, defaultTab = 0, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    onChange?.(index);
  };

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-2 border-b-2 border-gray-200 overflow-x-auto">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => handleTabChange(idx)}
            className={`px-4 py-3 font-medium transition whitespace-nowrap ${
              activeTab === idx
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-2'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">{tabs[activeTab].content}</div>
    </div>
  );
}
