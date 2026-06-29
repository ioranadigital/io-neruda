'use client';

import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        });

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'SYNC_OFFLINE_QUEUE') {
            // Trigger sync in the app
            window.dispatchEvent(
              new CustomEvent('offline-sync-needed', {
                detail: { timestamp: event.data.timestamp },
              })
            );
          }
        });

        // Register background sync
        if ('sync' in registration && registration.sync) {
          (registration.sync as any).register('sync-offline-queue').catch(() => {
            // Sync not supported
          });
        }

        console.log('Service Worker registered');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();

    // Cleanup
    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
    };
  }, []);
}
