import { buildCharset } from './generator';
import type { CharPoolOptions, GeneratorMode, StrengthResult } from './types';
import { WORD_LIST } from './wordlist';

const GUESSES_PER_SECOND = 10_000_000_000; // 10 billion offline guesses/sec

/** Unique character count — single source of truth shared with the generator. */
export function calculateCharsetSize(options: CharPoolOptions): number {
  return buildCharset(options).length;
}

export function calculateEntropyBits(
  mode: GeneratorMode,
  password: string,
  options: {
    length: number;
    wordCount: number;
    charsetSize: number;
  },
): number {
  if (!password) return 0;

  if (mode === 'passphrase') {
    return options.wordCount * Math.log2(WORD_LIST.length);
  }

  if (options.charsetSize <= 0) return 0;
  return options.length * Math.log2(options.charsetSize);
}

export function formatCrackTime(bits: number): string {
  if (bits <= 0) return 'Instant';

  const combinations = Math.pow(2, bits);
  const seconds = combinations / (2 * GUESSES_PER_SECOND);

  if (seconds < 1) return 'Less than a second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000 * 1000) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 31536000 * 1_000_000) return `${Math.round(seconds / (31536000 * 1000))} thousand years`;
  if (seconds < 31536000 * 1_000_000_000) return `${Math.round(seconds / (31536000 * 1_000_000))} million years`;
  return 'Centuries+';
}

export function strengthFromEntropy(bits: number): StrengthResult {
  if (bits <= 0) {
    return { score: 0, label: 'VERY WEAK', color: 'bg-red-500', text: 'text-red-500' };
  }
  if (bits < 40) {
    return { score: 1, label: 'VERY WEAK', color: 'bg-red-500', text: 'text-red-500' };
  }
  if (bits < 60) {
    return { score: 2, label: 'WEAK', color: 'bg-orange-500', text: 'text-orange-500' };
  }
  if (bits < 80) {
    return { score: 3, label: 'MEDIUM', color: 'bg-yellow-500', text: 'text-yellow-500' };
  }
  if (bits < 100) {
    return { score: 4, label: 'STRONG', color: 'bg-emerald-400', text: 'text-emerald-400' };
  }
  return { score: 5, label: 'VERY STRONG', color: 'bg-emerald-500', text: 'text-emerald-500' };
}
