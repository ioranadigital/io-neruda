'use client';

import React, { useEffect } from 'react';
import GeneratorPanel from '@/src/components/panels/GeneratorPanel';
import { useEmailTemplates } from '@/src/hooks/useEmailTemplates';
import { useGenerator } from '@/src/context/GeneratorContext';

export default function GeneratorsPage() {
  const { getTemplates } = useEmailTemplates();
  const { isLoading } = useGenerator();

  useEffect(() => {
    // Load email templates on mount
    getTemplates().catch(err => console.error('Failed to load templates:', err));
  }, [getTemplates]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Content Generator
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            Create professional content in 3 clicks ⚡
          </p>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <GeneratorPanel />
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-800 mb-1">Multi-Format</h3>
            <p className="text-gray-600 text-sm">Blog, Email, Social, PDF & more</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-1">Fast Generation</h3>
            <p className="text-gray-600 text-sm">Get results in seconds</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold text-gray-800 mb-1">Customizable</h3>
            <p className="text-gray-600 text-sm">Keywords, tone & formats</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600 text-sm">
          <p>Powered by Advanced AI • Secure • Reliable</p>
          <p className="mt-1">v2.0 - Content Generation System</p>
        </div>
      </div>
    </div>
  );
}
