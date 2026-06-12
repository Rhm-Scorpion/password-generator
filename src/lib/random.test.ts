import { describe, expect, it } from 'vitest';
import { getSecureRandomInt } from './random';

describe('random', () => {
  it('returns values within range', () => {
    for (let i = 0; i < 100; i++) {
      const value = getSecureRandomInt(10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
    }
  });

  it('covers all values in small range over many draws', () => {
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) {
      seen.add(getSecureRandomInt(5));
    }
    expect(seen.size).toBe(5);
  });

  it('throws for invalid max', () => {
    expect(() => getSecureRandomInt(0)).toThrow();
    expect(() => getSecureRandomInt(-1)).toThrow();
  });
});
