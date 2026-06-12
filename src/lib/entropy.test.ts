import { describe, expect, it } from 'vitest';
import {
  calculateCharsetSize,
  calculateEntropyBits,
  formatCrackTime,
  strengthFromEntropy,
} from './entropy';

describe('entropy', () => {
  it('calculates charset size from options', () => {
    expect(
      calculateCharsetSize({
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: false,
        avoidAmbiguous: false,
        customSymbols: '',
      }),
    ).toBe(62);
  });

  it('does not double-count custom symbols that overlap other pools', () => {
    expect(
      calculateCharsetSize({
        includeUppercase: false,
        includeLowercase: true,
        includeNumbers: false,
        includeSymbols: true,
        avoidAmbiguous: false,
        customSymbols: 'abc',
      }),
    ).toBe(26);
  });

  it('ignores whitespace and duplicates in custom symbols', () => {
    expect(
      calculateCharsetSize({
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: true,
        avoidAmbiguous: false,
        customSymbols: '!! @@ ##',
      }),
    ).toBe(3);
  });

  it('calculates password entropy in bits', () => {
    const bits = calculateEntropyBits('password', 'abcdefghijklmnop', {
      length: 16,
      wordCount: 4,
      charsetSize: 62,
    });
    expect(bits).toBeCloseTo(16 * Math.log2(62), 5);
  });

  it('calculates passphrase entropy in bits', () => {
    const bits = calculateEntropyBits('passphrase', 'word-word-word-word', {
      length: 16,
      wordCount: 4,
      charsetSize: 62,
    });
    expect(bits).toBeGreaterThan(35);
  });

  it('maps entropy to strength labels', () => {
    expect(strengthFromEntropy(30).label).toBe('VERY WEAK');
    expect(strengthFromEntropy(50).label).toBe('WEAK');
    expect(strengthFromEntropy(70).label).toBe('MEDIUM');
    expect(strengthFromEntropy(90).label).toBe('STRONG');
    expect(strengthFromEntropy(110).label).toBe('VERY STRONG');
  });

  it('formats crack time labels', () => {
    expect(formatCrackTime(0)).toBe('Instant');
    expect(formatCrackTime(20)).toMatch(/second|minute|hour|day|year/i);
  });
});
