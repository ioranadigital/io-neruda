'use client';

import React, { useState } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { Configuration, EnabledFormats } from '../../types/generator';
import { useCreateConfiguration } from '../../hooks/useConfigurations';
import { useGenerateContent } from '../../hooks/useGenerator';
import FormatSelector from '../selectors/FormatSelector';
import ToneSelector from '../selectors/ToneSelector';
import KeywordInput from '../selectors/KeywordInput';

export default function GeneratorPanel() {
  const { configurations, selectedConfig, selectConfiguration, isLoading, error } = useGenerator();
  const { createConfig } = useCreateConfiguration();
  const { generateContent, isGenerating } = useGenerateContent();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<{
    name: string;
    keywordsNiche: string[];
    keywordsLongtail: string[];
    tone: Configuration['tone'];
    enabledFormats: EnabledFormats;
  }>({
    name: '',
    keywordsNiche: [],
    keywordsLongtail: [],
    tone: 'professional',
    enabledFormats: {
      blog: false,
      email: false,
      social_linkedin: false,
      social_instagram: false,
      whatsapp: false,
      pdf: false,
    },
  });

  const handleStep1Next = () => {
    if (formData.name.trim()) {
      setStep(2);
    }
  };

  const handleStep2Next = () => {
    if (Object.values(formData.enabledFormats).some(v => v)) {
      setStep(3);
    }
  };

  const handleSaveAndGenerate = async () => {
    try {
      // Save configuration (map camelCase form -> snake_case Configuration)
      const config = await createConfig({
        name: formData.name,
        project_id: null,
        keywords_niche: formData.keywordsNiche,
        keywords_longtail: formData.keywordsLongtail,
        tone: formData.tone,
        enabled_formats: formData.enabledFormats,
        is_template: true,
        description: `Auto-generated config for ${formData.name}`,
      });

      selectConfiguration(config);

      // Generate content
      await generateContent({
        contentId: `content_${Date.now()}`,
        configId: config.id,
      });

      // Reset form
      setStep(1);
      setFormData({
        name: '',
        keywordsNiche: [],
        keywordsLongtail: [],
        tone: 'professional',
        enabledFormats: {
          blog: false,
          email: false,
          social_linkedin: false,
          social_instagram: false,
          whatsapp: false,
          pdf: false,
        },
      });
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Content Generator</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Configuration Name & Formats */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Step 1: Configuration</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Configuration Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Blog Posts Professional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <FormatSelector
            selectedFormats={formData.enabledFormats}
            onChange={(formats) => setFormData({ ...formData, enabledFormats: formats })}
          />

          <button
            onClick={handleStep1Next}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

      {/* Step 2: Keywords & Tone */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Step 2: Keywords & Tone</h2>

          <KeywordInput
            niche={formData.keywordsNiche}
            longtail={formData.keywordsLongtail}
            onChange={(niche, longtail) =>
              setFormData({ ...formData, keywordsNiche: niche, keywordsLongtail: longtail })
            }
          />

          <ToneSelector
            selectedTone={formData.tone}
            onChange={(tone) => setFormData({ ...formData, tone })}
          />

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              ← Back
            </button>
            <button
              onClick={handleStep2Next}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Generate */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Step 3: Review</h2>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p>
              <span className="font-semibold">Name:</span> {formData.name}
            </p>
            <p>
              <span className="font-semibold">Tone:</span> {formData.tone}
            </p>
            <p>
              <span className="font-semibold">Niche Keywords:</span> {formData.keywordsNiche.join(', ') || 'None'}
            </p>
            <p>
              <span className="font-semibold">Long-tail Keywords:</span> {formData.keywordsLongtail.join(', ') || 'None'}
            </p>
            <p>
              <span className="font-semibold">Formats:</span> {Object.entries(formData.enabledFormats)
                .filter(([, v]) => v)
                .map(([k]) => k)
                .join(', ')}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
            >
              ← Back
            </button>
            <button
              onClick={handleSaveAndGenerate}
              disabled={isGenerating || isLoading}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Content'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
