export interface Composition {
  uppercase: number;
  lowercase: number;
  numbers: number;
  symbols: number;
  total: number;
}

export function analyzeComposition(value: string): Composition {
  let uppercase = 0;
  let lowercase = 0;
  let numbers = 0;
  let symbols = 0;

  for (const char of value) {
    if (char >= 'A' && char <= 'Z') uppercase++;
    else if (char >= 'a' && char <= 'z') lowercase++;
    else if (char >= '0' && char <= '9') numbers++;
    else symbols++;
  }

  return { uppercase, lowercase, numbers, symbols, total: value.length };
}
