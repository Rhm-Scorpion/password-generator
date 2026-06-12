const COMMON_PASSWORDS = new Set([
  'password', 'password1', 'password123', '123456', '12345678', '123456789',
  '1234567890', 'qwerty', 'qwerty123', 'abc123', 'letmein', 'welcome',
  'admin', 'login', 'passw0rd', 'iloveyou', 'monkey', 'dragon', 'master',
  'sunshine', 'princess', 'football', 'baseball', 'shadow', 'superman',
  'trustno1', 'batman', 'access', 'hello', 'freedom', 'whatever', 'qazwsx',
  '654321', '111111', '000000', '987654321', '123123', '1234', '12345',
  'pass', 'test', 'guest', 'root', 'changeme', 'secret', 'default',
]);

const KEYBOARD_ROWS = [
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '1234567890',
];

const SEQUENCES = [
  'abcdefghijklmnopqrstuvwxyz',
  'zyxwvutsrqponmlkjihgfedcba',
  '0123456789',
  '9876543210',
];

function hasKeyboardPattern(value: string, minLength = 4): boolean {
  const lower = value.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    for (let i = 0; i <= row.length - minLength; i++) {
      const forward = row.slice(i, i + minLength);
      const backward = forward.split('').reverse().join('');
      if (lower.includes(forward) || lower.includes(backward)) {
        return true;
      }
    }
  }
  return false;
}

function hasSequence(value: string, minLength = 4): boolean {
  const lower = value.toLowerCase();
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - minLength; i++) {
      const forward = seq.slice(i, i + minLength);
      const backward = forward.split('').reverse().join('');
      if (lower.includes(forward) || lower.includes(backward)) {
        return true;
      }
    }
  }
  return false;
}

function hasRepetition(value: string, minLength = 3): boolean {
  return new RegExp(`(.)\\1{${minLength - 1},}`).test(value);
}

function hasAlternatingPattern(value: string): boolean {
  if (value.length < 4) return false;
  for (let i = 2; i < value.length; i++) {
    if (value[i] !== value[i % 2]) {
      return false;
    }
  }
  return true;
}

function hasYearPattern(value: string): boolean {
  return /\b(19|20)\d{2}\b/.test(value);
}

export interface PatternMatch {
  type: string;
  description: string;
}

export function detectBlacklistedPatterns(value: string): PatternMatch[] {
  if (!value) return [];

  const matches: PatternMatch[] = [];
  const lower = value.toLowerCase();

  if (COMMON_PASSWORDS.has(lower)) {
    matches.push({ type: 'common', description: 'Common password' });
  }

  for (const common of COMMON_PASSWORDS) {
    if (common.length >= 4 && lower.includes(common)) {
      matches.push({ type: 'common-substring', description: `Contains "${common}"` });
      break;
    }
  }

  if (hasSequence(value)) {
    matches.push({ type: 'sequence', description: 'Sequential characters' });
  }

  if (hasKeyboardPattern(value)) {
    matches.push({ type: 'keyboard', description: 'Keyboard pattern' });
  }

  if (hasRepetition(value)) {
    matches.push({ type: 'repetition', description: 'Repeated characters' });
  }

  if (hasAlternatingPattern(value)) {
    matches.push({ type: 'alternating', description: 'Alternating pattern' });
  }

  if (hasYearPattern(value)) {
    matches.push({ type: 'year', description: 'Contains a year' });
  }

  return matches;
}

export function isBlacklisted(value: string): boolean {
  return detectBlacklistedPatterns(value).length > 0;
}
