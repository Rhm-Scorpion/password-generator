import { isBlacklisted } from './blacklist';
import { getSecureRandomInt, pickRandomChar, shuffleArray } from './random';
import type { CharPoolOptions, GeneratorOptions } from './types';
import { WORD_LIST } from './wordlist';

const DEFAULT_SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
const MAX_BLACKLIST_RETRIES = 50;

function uniqueChars(value: string): string {
  return Array.from(new Set(value)).join('');
}

/** Strips whitespace and duplicate characters from user-provided symbols. */
function sanitizeSymbols(symbols: string): string {
  return uniqueChars(symbols.replace(/\s/g, ''));
}

function buildCharPools(options: CharPoolOptions): string[] {
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = sanitizeSymbols(options.customSymbols) || DEFAULT_SYMBOLS;

  if (options.avoidAmbiguous) {
    uppercase = uppercase.replace(/[IO]/g, '');
    lowercase = lowercase.replace(/[l]/g, '');
    numbers = numbers.replace(/[01]/g, '');
  }

  const pools: string[] = [];
  if (options.includeUppercase) pools.push(uppercase);
  if (options.includeLowercase) pools.push(lowercase);
  if (options.includeNumbers) pools.push(numbers);
  if (options.includeSymbols) pools.push(symbols);

  return pools;
}

/**
 * Full character set as unique characters. Deduplication matters when custom
 * symbols overlap other pools — otherwise the distribution would be biased
 * and the entropy estimate inflated.
 */
export function buildCharset(options: CharPoolOptions): string {
  return uniqueChars(buildCharPools(options).join(''));
}

function generatePasswordCandidate(options: GeneratorOptions['password']): string {
  const pools = buildCharPools(options);
  if (pools.length === 0) return '';

  let password = '';

  for (const pool of pools) {
    if (password.length < options.length) {
      password += pickRandomChar(pool);
    }
  }

  const charset = buildCharset(options);
  while (password.length < options.length) {
    password += pickRandomChar(charset);
  }

  return shuffleArray(password.split('')).join('');
}

function generatePassphraseCandidate(options: GeneratorOptions['passphrase']): string {
  const words: string[] = [];
  for (let i = 0; i < options.wordCount; i++) {
    words.push(WORD_LIST[getSecureRandomInt(WORD_LIST.length)]);
  }
  return words.join('-');
}

export function generateSecret(options: GeneratorOptions): string {
  const { mode, password, passphrase, enforcePatternBlacklist } = options;

  for (let attempt = 0; attempt < MAX_BLACKLIST_RETRIES; attempt++) {
    const candidate =
      mode === 'passphrase'
        ? generatePassphraseCandidate(passphrase)
        : generatePasswordCandidate(password);

    if (!candidate) return candidate;
    if (!enforcePatternBlacklist || !isBlacklisted(candidate)) {
      return candidate;
    }
  }

  return mode === 'passphrase'
    ? generatePassphraseCandidate(passphrase)
    : generatePasswordCandidate(password);
}

export { buildCharPools, MAX_BLACKLIST_RETRIES };
