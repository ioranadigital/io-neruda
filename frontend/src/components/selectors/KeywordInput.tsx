'use client';

import React, { useState } from 'react';

interface KeywordInputProps {
  niche: string[];
  longtail: string[];
  onChange: (niche: string[], longtail: string[]) => void;
}

export default function KeywordInput({ niche, longtail, onChange }: KeywordInputProps) {
  const [nicheInput, setNicheInput] = useState('');
  const [longtailInput, setLongtailInput] = useState('');

  const addNicheKeyword = () => {
    if (nicheInput.trim()) {
      onChange([...niche, nicheInput.trim()], longtail);
      setNicheInput('');
    }
  };

  const addLongtailKeyword = () => {
    if (longtailInput.trim()) {
      onChange(niche, [...longtail, longtailInput.trim()]);
      setLongtailInput('');
    }
  };

  const removeNiche = (index: number) => {
    onChange(niche.filter((_, i) => i !== index), longtail);
  };

  const removeLongtail = (index: number) => {
    onChange(niche, longtail.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Niche Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Niche Keywords (2-3 occurrences)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={nicheInput}
            onChange={(e) => setNicheInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNicheKeyword()}
            placeholder="e.g., AI writing"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNicheKeyword}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {niche.map((keyword, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {keyword}
              <button
                onClick={() => removeNiche(idx)}
                className="hover:text-blue-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Long-tail Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Long-tail Keywords (1 occurrence)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={longtailInput}
            onChange={(e) => setLongtailInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLongtailKeyword()}
            placeholder="e.g., how to use AI for writing"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={addLongtailKeyword}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {longtail.map((keyword, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              {keyword}
              <button
                onClick={() => removeLongtail(idx)}
                className="hover:text-green-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
