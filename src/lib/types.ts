export type GeneratorMode = 'password' | 'passphrase';

export interface CharPoolOptions {
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
  customSymbols: string;
}

export interface PasswordOptions extends CharPoolOptions {
  length: number;
}

export interface PassphraseOptions {
  wordCount: number;
}

export interface GeneratorOptions {
  mode: GeneratorMode;
  password: PasswordOptions;
  passphrase: PassphraseOptions;
  enforcePatternBlacklist: boolean;
}

export interface StrengthResult {
  score: number;
  label: string;
  color: string;
  text: string;
}

export interface EntropyResult {
  bits: number;
  strength: StrengthResult;
  crackTimeLabel: string;
}
