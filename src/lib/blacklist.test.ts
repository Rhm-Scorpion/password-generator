import { describe, expect, it } from 'vitest';
import { detectBlacklistedPatterns, isBlacklisted } from './blacklist';

describe('blacklist', () => {
  it('flags common passwords', () => {
    expect(isBlacklisted('password123')).toBe(true);
    expect(isBlacklisted('123456')).toBe(true);
  });

  it('flags keyboard patterns', () => {
    expect(isBlacklisted('qwertyui')).toBe(true);
    expect(isBlacklisted('asdfgh')).toBe(true);
  });

  it('flags sequential characters', () => {
    expect(isBlacklisted('abcd1234')).toBe(true);
    expect(isBlacklisted('9876')).toBe(true);
  });

  it('flags repeated characters', () => {
    expect(isBlacklisted('aaa')).toBe(true);
    expect(isBlacklisted('xxxxx')).toBe(true);
  });

  it('flags alternating patterns including odd lengths', () => {
    expect(isBlacklisted('abab')).toBe(true);
    expect(isBlacklisted('ababa')).toBe(true);
    expect(isBlacklisted('x7x7x7x')).toBe(true);
  });

  it('allows strong random passwords', () => {
    expect(isBlacklisted('K9#mP2$vL8@nQ4!')).toBe(false);
  });

  it('returns pattern descriptions', () => {
    const matches = detectBlacklistedPatterns('password123');
    expect(matches.length).toBeGreaterThan(0);
  });
});
