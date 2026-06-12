import type { GeneratorMode } from './types';

export interface PresetConfig {
  mode: GeneratorMode;
  length: number;
  wordCount: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
  customSymbols: string;
}

export const DEFAULT_CONFIG: PresetConfig = {
  mode: 'password',
  length: 16,
  wordCount: 4,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  avoidAmbiguous: false,
  customSymbols: '',
};

export interface Preset {
  id: string;
  label: string;
  description: string;
  config: PresetConfig;
}

export const PRESETS: Preset[] = [
  {
    id: 'pin',
    label: 'PIN',
    description: '8 digits',
    config: {
      ...DEFAULT_CONFIG,
      length: 8,
      includeUppercase: false,
      includeLowercase: false,
      includeSymbols: false,
    },
  },
  {
    id: 'memorable',
    label: 'Memorable',
    description: '4-word passphrase',
    config: { ...DEFAULT_CONFIG, mode: 'passphrase' },
  },
  {
    id: 'strong',
    label: 'Strong',
    description: '16 chars, all types',
    config: { ...DEFAULT_CONFIG },
  },
  {
    id: 'maximum',
    label: 'Maximum',
    description: '64 chars, all types',
    config: { ...DEFAULT_CONFIG, length: 64 },
  },
];
