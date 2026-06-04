'use client';

import React, { useEffect } from 'react';
import GeneratorPanel from '../components/panels/GeneratorPanel';
import { useEmailTemplates } from '../hooks/useEmailTemplates';
import { useGenerator } from '../context/GeneratorContext';

export default function GeneratorPage() {
  const { getTemplates } = useEmailTemplates();
  const { isLoading } = useGenerator();

  useEffect(() => {
    // Load email templates on mount
    getTemplates();
  }, [getTemplates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Content Generation System v2.0
          </h1>
          <p className="text-gray-600 text-lg">
            Generate professional content in 3 clicks
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center mb-4">
            <div className="inline-block">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}

        {/* Main Content */}
        <GeneratorPanel />

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Powered by AI • Fast • Reliable • Free</p>
        </div>
      </div>
    </div>
  );
}
