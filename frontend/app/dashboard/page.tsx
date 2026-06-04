'use client';

import React, { useState } from 'react';
import GeneratorPanel from '@/src/components/panels/GeneratorPanel';
import ContentGallery from '@/src/components/panels/ContentGallery';
import EmailTemplateBuilder from '@/src/components/panels/EmailTemplateBuilder';
import BatchMonitor from '@/src/components/panels/BatchMonitor';
import { useGenerator } from '@/src/context/GeneratorContext';

type TabType = 'generate' | 'gallery' | 'templates' | 'batch';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const { generatedContent, batchJobs } = useGenerator();

  const recentContent = generatedContent[0];
  const activeBatch = batchJobs.find(j => ['pending', 'processing'].includes(j.status));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-800">Content Generation Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your content generation workflow</p>
        </div>
      </div>

      {/* Batch Monitor (if active) */}
      {activeBatch && (
        <BatchMonitor
          batchJobId={activeBatch.id}
          onComplete={(job) => {
            setSelectedBatchId(null);
          }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-20">
              <h2 className="font-bold text-gray-800 mb-4">Navigation</h2>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                    activeTab === 'generate'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ✨ Generate
                </button>

                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    if (recentContent) setSelectedContentId(recentContent.content_id);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                    activeTab === 'gallery'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📚 Gallery
                  {generatedContent.length > 0 && (
                    <span className="ml-1 text-xs">({generatedContent.length})</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('templates')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                    activeTab === 'templates'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  🎨 Templates
                </button>

                <button
                  onClick={() => {
                    setActiveTab('batch');
                    if (activeBatch) setSelectedBatchId(activeBatch.id);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${
                    activeTab === 'batch'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ⚡ Batch Jobs
                  {batchJobs.length > 0 && (
                    <span className="ml-1 text-xs">({batchJobs.length})</span>
                  )}
                </button>
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Generated</p>
                  <p className="text-2xl font-bold text-blue-600">{generatedContent.length}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">Batch Jobs</p>
                  <p className="text-2xl font-bold text-purple-600">{batchJobs.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'generate' && <GeneratorPanel />}

            {activeTab === 'gallery' && selectedContentId && (
              <ContentGallery contentId={selectedContentId} />
            )}

            {activeTab === 'gallery' && !selectedContentId && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-600 mb-4">No content selected</p>
                <p className="text-gray-500 text-sm">Generate some content first to view it here</p>
              </div>
            )}

            {activeTab === 'templates' && <EmailTemplateBuilder />}

            {activeTab === 'batch' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Batch Jobs</h2>

                {batchJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No batch jobs yet</p>
                    <p className="text-gray-500 text-sm">Create a batch job from the generator</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batchJobs.map(job => (
                      <div key={job.id} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-gray-800">Batch Job {job.id.substring(0, 8)}</h3>
                            <p className="text-sm text-gray-500">
                              {job.total_items} items • Concurrency: {job.concurrency_limit}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              job.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : job.status === 'failed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-600">Processed</p>
                            <p className="font-bold text-gray-800">{job.processed_items || 0}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-600">Failed</p>
                            <p className="font-bold text-gray-800">{job.failed_items || 0}</p>
                          </div>
                          <div className="bg-gray-50 p-2 rounded">
                            <p className="text-gray-600">Progress</p>
                            <p className="font-bold text-gray-800">{job.percentComplete || 0}%</p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedBatchId(job.id)}
                          className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
