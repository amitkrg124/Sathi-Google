import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryCache } from '../src/server/cache';

describe('Efficiency & In-Memory TTL Cache Engine', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache(10, 500); // 10 entries max, 500ms TTL
  });

  it('should store and retrieve data with zero-latency cache hit', () => {
    cache.set('query:bill', { reply: 'Your bill is Rs 500' });
    const cached = cache.get<{ reply: string }>('query:bill');

    expect(cached).toBeDefined();
    expect(cached?.reply).toBe('Your bill is Rs 500');
    expect(cache.getStats().hits).toBe(1);
  });

  it('should expire stale entries after TTL', async () => {
    cache.set('temp:key', 'quick-data', 50); // 50ms TTL
    expect(cache.get('temp:key')).toBe('quick-data');

    // Wait for TTL expiration
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(cache.get('temp:key')).toBeNull();
    expect(cache.getStats().misses).toBe(1);
  });

  it('should evict oldest entries when capacity exceeds max', () => {
    for (let i = 0; i < 15; i++) {
      cache.set(`key:${i}`, `value:${i}`);
    }

    expect(cache.getStats().size).toBeLessThanOrEqual(10);
  });
});
