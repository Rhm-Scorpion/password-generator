const MAX_UINT32 = 0xffffffff;

/** Uniform index in [0, max) using rejection sampling to avoid modulo bias. */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) {
    throw new Error('max must be positive');
  }

  const limit = MAX_UINT32 - (MAX_UINT32 % max);
  const buffer = new Uint32Array(1);

  do {
    crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return buffer[0] % max;
}

export function pickRandomChar(charset: string): string {
  return charset[getSecureRandomInt(charset.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
