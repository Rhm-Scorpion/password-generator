import { describe, expect, it } from 'vitest';
import { isBlacklisted } from './blacklist';
import { generateSecret } from './generator';

describe('generator', () => {
  it('generates password with requested length', () => {
    const password = generateSecret({
      mode: 'password',
      password: {
        length: 20,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        avoidAmbiguous: false,
        customSymbols: '',
      },
      passphrase: { wordCount: 4 },
      enforcePatternBlacklist: false,
    });

    expect(password).toHaveLength(20);
  });

  it('includes at least one character from each selected pool', () => {
    const password = generateSecret({
      mode: 'password',
      password: {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        avoidAmbiguous: false,
        customSymbols: '',
      },
      passphrase: { wordCount: 4 },
      enforcePatternBlacklist: false,
    });

    expect(/[A-Z]/.test(password)).toBe(true);
    expect(/[a-z]/.test(password)).toBe(true);
    expect(/[0-9]/.test(password)).toBe(true);
    expect(/[^A-Za-z0-9]/.test(password)).toBe(true);
  });

  it('returns empty string when no character pools are selected', () => {
    const password = generateSecret({
      mode: 'password',
      password: {
        length: 16,
        includeUppercase: false,
        includeLowercase: false,
        includeNumbers: false,
        includeSymbols: false,
        avoidAmbiguous: false,
        customSymbols: '',
      },
      passphrase: { wordCount: 4 },
      enforcePatternBlacklist: false,
    });

    expect(password).toBe('');
  });

  it('generates passphrase with requested word count', () => {
    const passphrase = generateSecret({
      mode: 'passphrase',
      password: {
        length: 16,
        includeUppercase: true,
        includeLowercase: true,
        includeNumbers: true,
        includeSymbols: true,
        avoidAmbiguous: false,
        customSymbols: '',
      },
      passphrase: { wordCount: 5 },
      enforcePatternBlacklist: false,
    });

    expect(passphrase.split('-')).toHaveLength(5);
  });

  it('avoids blacklisted patterns when enforcement is enabled', () => {
    for (let i = 0; i < 25; i++) {
      const password = generateSecret({
        mode: 'password',
        password: {
          length: 16,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSymbols: true,
          avoidAmbiguous: false,
          customSymbols: '',
        },
        passphrase: { wordCount: 4 },
        enforcePatternBlacklist: true,
      });

      expect(isBlacklisted(password)).toBe(false);
    }
  });
});
