import { describe, expect, it } from 'vitest';
import { isBlacklisted } from './blacklist';
import { WORD_LIST } from './wordlist';

describe('wordlist', () => {
  it('contains at least 1000 unique words', () => {
    expect(WORD_LIST.length).toBeGreaterThanOrEqual(1000);
    expect(new Set(WORD_LIST).size).toBe(WORD_LIST.length);
  });

  it('contains no words that trip the pattern blacklist', () => {
    const flagged = WORD_LIST.filter((word) => isBlacklisted(word));
    expect(flagged).toEqual([]);
  });
});
