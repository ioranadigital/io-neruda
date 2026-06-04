'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { dbManager, STORES } from '@/src/utils/indexeddb';
import { showToast } from '@/src/components/shared/Toast';

interface SyncOperation {
  id: number;
  type: 'create' | 'update' | 'delete';
  store: string;
  data: any;
  timestamp: number;
}

export function useOfflineSync(enabled = true) {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Monitor online/offline status
  useEffect(() => {
    if (!enabled) return;

    const handleOnline = async () => {
      setIsOnline(true);
      showToast.success('Conexión restaurada. Sincronizando...');
      await syncOfflineQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      showToast.warning('Sin conexión. Los cambios se sincronizarán cuando vuelvas a conectarte.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enabled]);

  // Update pending count
  useEffect(() => {
    const updatePendingCount = async () => {
      try {
        await dbManager.init();
        const queue = await dbManager.getSyncQueue();
        setPendingCount(queue.length);
      } catch (err) {
        console.error('Error getting sync queue:', err);
      }
    };

    updatePendingCount();
    syncIntervalRef.current = setInterval(updatePendingCount, 5000);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  const queueOperation = useCallback(
    async (
      type: 'create' | 'update' | 'delete',
      store: string,
      data: any
    ): Promise<void> => {
      try {
        await dbManager.init();
        await dbManager.addToSyncQueue({
          type,
          store: store as any,
          data,
          timestamp: Date.now(),
        });
        setPendingCount((prev) => prev + 1);

        if (isOnline) {
          await syncOfflineQueue();
        }
      } catch (err) {
        console.error('Error queuing operation:', err);
        throw err;
      }
    },
    [isOnline]
  );

  const syncOfflineQueue = useCallback(async (): Promise<void> => {
    if (isSyncing || !isOnline) return;

    setIsSyncing(true);
    try {
      await dbManager.init();
      const queue = await dbManager.getSyncQueue();

      if (queue.length === 0) {
        setIsSyncing(false);
        return;
      }

      for (const operation of queue) {
        try {
          // Determine endpoint based on operation type and store
          let endpoint = '';
          let method = 'POST';
          let body = operation.data;

          switch (operation.store) {
            case STORES.generated_content:
              if (operation.type === 'update') {
                endpoint = `/api/generators/generated/${operation.data.id}`;
                method = 'PUT';
              } else if (operation.type === 'delete') {
                endpoint = `/api/generators/generated/${operation.data.id}`;
                method = 'DELETE';
                body = undefined;
              } else {
                endpoint = '/api/generators/generate';
              }
              break;

            case STORES.batch_jobs:
              if (operation.type === 'delete') {
                endpoint = `/api/generators/batch/${operation.data.id}/cancel`;
                method = 'POST';
              }
              break;

            case STORES.email_templates:
              if (operation.type === 'update') {
                endpoint = `/api/generators/email-templates/${operation.data.id}`;
                method = 'PUT';
              } else {
                endpoint = '/api/generators/email-templates';
              }
              break;
          }

          if (!endpoint) {
            await dbManager.removeSyncQueueItem(operation.id);
            continue;
          }

          const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: body ? JSON.stringify(body) : undefined,
          });

          if (response.ok) {
            await dbManager.removeSyncQueueItem(operation.id);
            setPendingCount((prev) => Math.max(0, prev - 1));
          } else {
            console.error(`Sync failed for operation ${operation.id}:`, response.statusText);
          }
        } catch (err) {
          console.error('Error syncing operation:', err);
          // Don't remove from queue if sync fails
        }
      }

      showToast.success('Sincronización completada');
    } catch (err) {
      console.error('Error syncing queue:', err);
      showToast.error('Error sincronizando datos offline');
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isSyncing]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    queueOperation,
    syncOfflineQueue,
  };
}
