import { GeneratedContent, BatchJob, Configuration, EmailTemplate } from '@/src/types/generator';

const DB_NAME = 'io-neruda-cache';
const DB_VERSION = 1;

export const STORES = {
  generated_content: 'generated_content',
  batch_jobs: 'batch_jobs',
  configurations: 'configurations',
  email_templates: 'email_templates',
  sync_queue: 'sync_queue',
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

export class IndexedDBManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Generated content store
        if (!db.objectStoreNames.contains(STORES.generated_content)) {
          const store = db.createObjectStore(STORES.generated_content, { keyPath: 'id' });
          store.createIndex('projectId', 'projectId', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Batch jobs store
        if (!db.objectStoreNames.contains(STORES.batch_jobs)) {
          const store = db.createObjectStore(STORES.batch_jobs, { keyPath: 'id' });
          store.createIndex('projectId', 'projectId', { unique: false });
          store.createIndex('status', 'status', { unique: false });
        }

        // Configurations store
        if (!db.objectStoreNames.contains(STORES.configurations)) {
          db.createObjectStore(STORES.configurations, { keyPath: 'id' });
        }

        // Email templates store
        if (!db.objectStoreNames.contains(STORES.email_templates)) {
          const store = db.createObjectStore(STORES.email_templates, { keyPath: 'id' });
          store.createIndex('projectId', 'projectId', { unique: false });
        }

        // Sync queue for offline operations
        if (!db.objectStoreNames.contains(STORES.sync_queue)) {
          db.createObjectStore(STORES.sync_queue, { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async set<T extends object>(store: StoreName, data: T): Promise<T> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction([store], 'readwrite');
    const objectStore = tx.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.put(data);
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(store: StoreName, key: string): Promise<T | undefined> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction([store], 'readonly');
    const objectStore = tx.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(store: StoreName): Promise<T[]> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction([store], 'readonly');
    const objectStore = tx.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllByIndex<T>(store: StoreName, indexName: string, value: any): Promise<T[]> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction([store], 'readonly');
    const objectStore = tx.objectStore(store);
    const index = objectStore.index(indexName);
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(store: StoreName, key: string): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction([store], 'readwrite');
    const objectStore = tx.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(store: StoreName): Promise<void> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction([store], 'readwrite');
    const objectStore = tx.objectStore(store);
    return new Promise((resolve, reject) => {
      const request = objectStore.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Sync queue operations
  async addToSyncQueue(operation: {
    type: 'create' | 'update' | 'delete';
    store: StoreName;
    data: any;
    timestamp: number;
  }): Promise<void> {
    await this.set(STORES.sync_queue, operation);
  }

  async getSyncQueue(): Promise<
    Array<{
      id: number;
      type: 'create' | 'update' | 'delete';
      store: StoreName;
      data: any;
      timestamp: number;
    }>
  > {
    return this.getAll(STORES.sync_queue);
  }

  async removeSyncQueueItem(id: number): Promise<void> {
    const tx = this.db!.transaction([STORES.sync_queue], 'readwrite');
    const objectStore = tx.objectStore(STORES.sync_queue);
    return new Promise((resolve, reject) => {
      const request = objectStore.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearSyncQueue(): Promise<void> {
    await this.clear(STORES.sync_queue);
  }
}

export const dbManager = new IndexedDBManager();

export const STORE_NAMES = STORES;
