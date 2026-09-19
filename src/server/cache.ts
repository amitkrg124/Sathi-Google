/**
 * Saathi AI - High Performance In-Memory TTL Cache
 * Provides sub-millisecond response times for repeated queries & scam analyses.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class MemoryCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private maxEntries: number;
  private defaultTTLMs: number;
  private hits: number = 0;
  private misses: number = 0;

  constructor(maxEntries: number = 500, defaultTTLMs: number = 10 * 60 * 1000) {
    this.maxEntries = maxEntries;
    this.defaultTTLMs = defaultTTLMs;
  }

  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs?: number): void {
    if (this.store.size >= this.maxEntries) {
      // Evict oldest entry
      const firstKey = this.store.keys().next().value;
      if (firstKey) {
        this.store.delete(firstKey);
      }
    }

    const expiresAt = Date.now() + (ttlMs || this.defaultTTLMs);
    this.store.set(key, { data, expiresAt });
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public clear(): void {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  public getStats() {
    return {
      size: this.store.size,
      hits: this.hits,
      misses: this.misses,
      hitRatio: this.hits + this.misses > 0 ? (this.hits / (this.hits + this.misses)).toFixed(2) : '0.00',
    };
  }
}

export const apiCache = new MemoryCache(500, 15 * 60 * 1000); // 15 min TTL
