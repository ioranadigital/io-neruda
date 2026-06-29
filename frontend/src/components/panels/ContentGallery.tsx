'use client';

import React, { useState, useEffect } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { ContentFormat, GeneratedContent } from '../../types/generator';

interface ContentGalleryProps {
  contentId: string;
}

const FORMAT_ICONS: Record<ContentFormat, string> = {
  blog: '📝',
  email: '✉️',
  social_linkedin: '💼',
  social_instagram: '📸',
  whatsapp: '💬',
  pdf: '📄',
};

const FORMAT_NAMES: Record<ContentFormat, string> = {
  blog: 'Blog Post',
  email: 'Email',
  social_linkedin: 'LinkedIn',
  social_instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  pdf: 'PDF Report',
};

export default function ContentGallery({ contentId }: ContentGalleryProps) {
  const { generatedContent } = useGenerator();

  const [selectedFormat, setSelectedFormat] = useState<ContentFormat | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleEdit = (item: GeneratedContent) => {
    setEditingId(item.id);
    setEditText(item.generated_text);
  };

  const handleSaveEdit = async (id: string) => {
    setEditingId(null);
  };

  const handlePublish = async (id: string) => {
    // TODO: Implement publish functionality
  };

  const filteredContent = selectedFormat
    ? generatedContent.filter(c => c.format === selectedFormat)
    : generatedContent;

  const groupedByFormat = generatedContent.reduce(
    (acc, item) => {
      if (!acc[item.format]) acc[item.format] = [];
      acc[item.format].push(item);
      return acc;
    },
    {} as Record<ContentFormat, GeneratedContent[]>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Generated Content</h2>

        {generatedContent.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mt-2">No hay contenido generado aún</p>
          </div>
        ) : generatedContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No generated content yet. Generate some content to see it here!</p>
          </div>
        ) : (
          <>
            {/* Format Tabs */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedFormat(null)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedFormat === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All ({generatedContent.length})
              </button>
              {Object.entries(groupedByFormat).map(([format, items]) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format as ContentFormat)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedFormat === format
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {FORMAT_ICONS[format as ContentFormat]} {FORMAT_NAMES[format as ContentFormat]} ({items.length})
                </button>
              ))}
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {filteredContent.map(item => (
                <div
                  key={item.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {FORMAT_ICONS[item.format]} {FORMAT_NAMES[item.format]}
                      </h3>
                      <p className="text-sm text-gray-500">
                        v{item.version} • {item.word_count} words • {item.keyword_density.toFixed(2)}% density
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Content Preview/Edit */}
                  {editingId === item.id ? (
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  ) : (
                    <p className="text-gray-700 text-sm line-clamp-3 mb-3 whitespace-pre-wrap">
                      {item.generated_text}
                    </p>
                  )}

                  {/* Keywords */}
                  {item.keywords_used.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Keywords Used:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.keywords_used.map((kw, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {editingId === item.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleCopy(item.generated_text, item.id)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          {copied === item.id ? '✓ Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Edit
                        </button>
                        {item.status !== 'published' && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Publish
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
