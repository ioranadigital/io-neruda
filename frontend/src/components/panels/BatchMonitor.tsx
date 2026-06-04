'use client';

import React, { useState, useEffect } from 'react';
import { useGenerator } from '../../context/GeneratorContext';
import { useBatchProgress } from '../../hooks/useBatchJobs';
import { BatchJob } from '../../types/generator';

interface BatchMonitorProps {
  batchJobId: string;
  onComplete?: (job: BatchJob) => void;
}

export default function BatchMonitor({ batchJobId, onComplete }: BatchMonitorProps) {
  const { batchJobs } = useGenerator();
  const { getProgress, progress, startPolling, stopPolling, isPolling } = useBatchProgress();
  const [isVisible, setIsVisible] = useState(true);

  const currentJob = batchJobs.find(j => j.id === batchJobId) || progress;

  useEffect(() => {
    if (batchJobId && !isPolling) {
      startPolling(batchJobId);
    }

    return () => {
      if (isPolling) {
        stopPolling();
      }
    };
  }, [batchJobId, isPolling, startPolling, stopPolling]);

  // Call onComplete when batch is done
  useEffect(() => {
    if (currentJob && (currentJob.status === 'completed' || currentJob.status === 'failed' || currentJob.status === 'partial') && onComplete) {
      onComplete(currentJob);
      stopPolling();
    }
  }, [currentJob?.status, onComplete, stopPolling]);

  if (!currentJob || !isVisible) {
    return null;
  }

  const isComplete = ['completed', 'failed', 'partial'].includes(currentJob.status);
  const percentComplete = currentJob.percentComplete || 0;
  const statusColor =
    currentJob.status === 'completed'
      ? 'bg-green-500'
      : currentJob.status === 'failed'
      ? 'bg-red-500'
      : currentJob.status === 'partial'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-2xl border-2 border-gray-200 p-4 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-bold text-gray-800">Batch Processing</h3>
          <p className="text-sm text-gray-500">ID: {batchJobId.substring(0, 12)}...</p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`}></div>
        <span className="font-semibold text-gray-700 capitalize">{currentJob.status}</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-bold text-gray-700">{percentComplete}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${statusColor}`}
            style={{ width: `${percentComplete}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-blue-50 rounded p-2">
          <p className="text-xs text-gray-600">Total</p>
          <p className="font-bold text-blue-600">{currentJob.total_items}</p>
        </div>
        <div className="bg-green-50 rounded p-2">
          <p className="text-xs text-gray-600">Done</p>
          <p className="font-bold text-green-600">{currentJob.processed_items || 0}</p>
        </div>
        <div className="bg-red-50 rounded p-2">
          <p className="text-xs text-gray-600">Failed</p>
          <p className="font-bold text-red-600">{currentJob.failed_items || 0}</p>
        </div>
      </div>

      {/* Results (if completed) */}
      {isComplete && currentJob.results && currentJob.results.length > 0 && (
        <div className="mb-4 max-h-40 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-700 mb-2">Results:</p>
          <div className="space-y-1">
            {currentJob.results.map((result, idx) => (
              <div key={idx} className="text-xs">
                <span className="font-medium text-gray-700">
                  {result.contentId.substring(0, 8)}...
                </span>
                <span
                  className={`ml-2 px-2 py-0 rounded text-white ${
                    result.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {result.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!isComplete && (
          <button
            onClick={() => stopPolling()}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => setIsVisible(false)}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
            isComplete
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          {isComplete ? 'Done' : 'Minimize'}
        </button>
      </div>
    </div>
  );
}
