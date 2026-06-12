import { describe, expect, it } from 'vitest';
import { analyzeComposition } from './composition';

describe('composition', () => {
  it('counts character classes', () => {
    const result = analyzeComposition('Ab1!Cd2@');
    expect(result).toEqual({ uppercase: 2, lowercase: 2, numbers: 2, symbols: 2, total: 8 });
  });

  it('handles empty input', () => {
    expect(analyzeComposition('')).toEqual({
      uppercase: 0,
      lowercase: 0,
      numbers: 0,
      symbols: 0,
      total: 0,
    });
  });

  it('counts hyphens in passphrases as symbols', () => {
    const result = analyzeComposition('word-word');
    expect(result.symbols).toBe(1);
    expect(result.lowercase).toBe(8);
  });
});
