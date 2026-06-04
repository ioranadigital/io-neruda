import { useState, useCallback, useEffect } from 'react';
import { useGenerator } from '../context/GeneratorContext';
import { BatchJob, BatchRequest } from '../types/generator';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4006/api/generators';

export function useStartBatchJob() {
  const { setLoading, setError, setBatchJobs } = useGenerator();
  const [isStarting, setIsStarting] = useState(false);
  const [batchJobId, setBatchJobId] = useState<string | null>(null);

  const startBatch = useCallback(
    async (request: BatchRequest) => {
      setIsStarting(true);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to start batch job');
        }

        const data = await response.json();
        setBatchJobId(data.batchJobId);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      } finally {
        setIsStarting(false);
        setLoading(false);
      }
    },
    [setLoading, setError, setBatchJobs]
  );

  return { startBatch, isStarting, batchJobId };
}

export function useBatchProgress() {
  const { setLoading, setError, updateBatchJob } = useGenerator();
  const [progress, setProgress] = useState<BatchJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const getProgress = useCallback(
    async (jobId: string) => {
      try {
        const response = await fetch(`${API_BASE}/batch/${jobId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch batch progress');
        }

        const data = await response.json();
        setProgress(data);
        updateBatchJob(data);
        return data;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(message);
        throw error;
      }
    },
    [setError, updateBatchJob]
  );

  // Poll for updates while batch is processing
  useEffect(() => {
    if (!isPolling || !progress) return;

    const interval = setInterval(async () => {
      try {
        await getProgress(progress.id);
      } catch (error) {
        // Silently handle polling errors
        console.error('Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling if batch is done
    if (progress.status === 'completed' || progress.status === 'failed' || progress.status === 'partial') {
      setIsPolling(false);
    }

    return () => clearInterval(interval);
  }, [isPolling, progress, getProgress]);

  const startPolling = useCallback((jobId: string) => {
    setIsPolling(true);
    getProgress(jobId);
  }, [getProgress]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return { getProgress, progress, startPolling, stopPolling, isPolling };
}
