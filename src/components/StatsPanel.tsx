import { Clock, Gauge, Ruler, ShieldCheck, ShieldAlert } from 'lucide-react';
import { analyzeComposition } from '../lib/composition';
import type { GeneratorMode } from '../lib/types';

interface StatsPanelProps {
  entropyBits: number;
  crackTimeLabel: string;
  password: string;
  mode: GeneratorMode;
  patternFree: boolean;
}

const CARD_CLASS =
  'rounded-xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.03] px-4 py-3 transition-colors duration-500';

const COMPOSITION_COLORS = {
  uppercase: { text: 'text-sky-600 dark:text-sky-400', bar: 'bg-sky-500' },
  lowercase: { text: 'text-emerald-600 dark:text-emerald-400', bar: 'bg-emerald-500' },
  numbers: { text: 'text-blue-600 dark:text-blue-400', bar: 'bg-blue-500' },
  symbols: { text: 'text-purple-600 dark:text-purple-400', bar: 'bg-purple-500' },
} as const;

export function StatsPanel({
  entropyBits,
  crackTimeLabel,
  password,
  mode,
  patternFree,
}: StatsPanelProps) {
  const composition = analyzeComposition(password);
  const wordCount = mode === 'passphrase' && password ? password.split('-').length : 0;

  const compositionChips =
    mode === 'passphrase'
      ? [
          { key: 'lowercase', label: 'words', value: wordCount },
          { key: 'numbers', label: 'chars', value: composition.total },
        ]
      : [
          { key: 'uppercase', label: 'A-Z', value: composition.uppercase },
          { key: 'lowercase', label: 'a-z', value: composition.lowercase },
          { key: 'numbers', label: '0-9', value: composition.numbers },
          { key: 'symbols', label: '!@#', value: composition.symbols },
        ];

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={CARD_CLASS}>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1">
            <Gauge size={13} /> Entropy
          </div>
          <div className="text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400 leading-none">
            {entropyBits.toFixed(1)}
            <span className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400 ml-1">
              bits
            </span>
          </div>
        </div>

        <div className={CARD_CLASS}>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1">
            <Clock size={13} /> Crack time
          </div>
          <div className="text-sm font-mono font-bold text-slate-900 dark:text-slate-200 leading-tight">
            {crackTimeLabel}
          </div>
        </div>

        <div className={CARD_CLASS}>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1">
            <Ruler size={13} /> Length
          </div>
          <div className="text-xl font-mono font-bold text-slate-900 dark:text-slate-200 leading-none">
            {composition.total}
            <span className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400 ml-1">
              {mode === 'passphrase' ? `chars · ${wordCount} words` : 'chars'}
            </span>
          </div>
        </div>

        <div className={CARD_CLASS}>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-1">
            {patternFree ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />} Patterns
          </div>
          <div
            className={`text-sm font-bold leading-tight ${
              patternFree
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {patternFree ? 'None found' : 'Detected'}
          </div>
        </div>
      </div>

      <div className={CARD_CLASS}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600 dark:text-slate-300">
            Composition{composition.total > 0 && ` (${composition.total} chars)`}
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {compositionChips.map((chip) => (
              <span key={chip.label} className="flex items-baseline gap-1 font-mono text-xs">
                <span
                  className={`font-bold ${COMPOSITION_COLORS[chip.key as keyof typeof COMPOSITION_COLORS].text}`}
                >
                  {chip.label}
                </span>
                <span className="text-slate-900 dark:text-slate-200">{chip.value}</span>
                {composition.total > 0 && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    ({Math.round((chip.value / composition.total) * 100)}%)
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {mode === 'password' && composition.total > 0 && (
          <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
            {(['uppercase', 'lowercase', 'numbers', 'symbols'] as const).map((key) =>
              composition[key] > 0 ? (
                <div
                  key={key}
                  className={`${COMPOSITION_COLORS[key].bar} transition-all duration-500`}
                  style={{ width: `${(composition[key] / composition.total) * 100}%` }}
                />
              ) : null,
            )}
          </div>
        )}
      </div>
    </div>
  );
}
