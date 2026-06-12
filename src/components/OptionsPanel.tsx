import { RotateCcw } from 'lucide-react';
import { GlassToggle } from './GlassToggle';
import { WORD_LIST } from '../lib/wordlist';
import type { GeneratorMode } from '../lib/types';

interface OptionsPanelProps {
  theme: 'dark' | 'light';
  mode: GeneratorMode;
  onModeChange: (mode: GeneratorMode) => void;
  length: number;
  wordCount: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
  customSymbols: string;
  enforcePatternBlacklist: boolean;
  copyOnClick: boolean;
  onLengthChange: (value: number) => void;
  onWordCountChange: (value: number) => void;
  onIncludeUppercaseChange: (value: boolean) => void;
  onIncludeLowercaseChange: (value: boolean) => void;
  onIncludeNumbersChange: (value: boolean) => void;
  onIncludeSymbolsChange: (value: boolean) => void;
  onAvoidAmbiguousChange: (value: boolean) => void;
  onCustomSymbolsChange: (value: string) => void;
  onEnforcePatternBlacklistChange: (value: boolean) => void;
  onCopyOnClickChange: (value: boolean) => void;
  onReset: () => void;
}

export function OptionsPanel({
  theme,
  mode,
  onModeChange,
  length,
  wordCount,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols,
  avoidAmbiguous,
  customSymbols,
  enforcePatternBlacklist,
  copyOnClick,
  onLengthChange,
  onWordCountChange,
  onIncludeUppercaseChange,
  onIncludeLowercaseChange,
  onIncludeNumbersChange,
  onIncludeSymbolsChange,
  onAvoidAmbiguousChange,
  onCustomSymbolsChange,
  onEnforcePatternBlacklistChange,
  onCopyOnClickChange,
  onReset,
}: OptionsPanelProps) {
  const sliderValue = mode === 'password' ? length : wordCount;
  const sliderMin = mode === 'password' ? 8 : 3;
  const sliderMax = mode === 'password' ? 64 : 8;
  const sliderProgress = ((sliderValue - sliderMin) / (sliderMax - sliderMin)) * 100;

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-white/[0.03] backdrop-blur-[15px] border border-slate-300 dark:border-white/[0.05] rounded-2xl p-4 [@media(min-height:900px)]:p-5 flex flex-col gap-3 [@media(min-height:900px)]:gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] lg:overflow-y-auto custom-scrollbar transition-colors duration-500">
      <div
        role="tablist"
        aria-label="Generator mode"
        className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08]"
      >
        {(['password', 'passphrase'] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => onModeChange(value)}
            className={`py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
              mode === value
                ? 'bg-emerald-500 text-white dark:text-[#070B0E] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/[0.05]'
            }`}
          >
            {value === 'password' ? 'Password' : 'Passphrase'}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
            {mode === 'password' ? 'Character Length' : 'Word Count'}
          </span>
          <span className="text-xl font-mono text-emerald-700 dark:text-emerald-400 leading-none">
            {sliderValue}
          </span>
        </div>

        <div className="relative py-1">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step="1"
            value={sliderValue}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (mode === 'password') {
                onLengthChange(value);
              } else {
                onWordCountChange(value);
              }
            }}
            className="w-full h-1 bg-slate-300 dark:bg-white/10 rounded-full appearance-none cursor-pointer outline-none z-10 relative"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${sliderProgress}%, ${
                theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              } ${sliderProgress}%, ${
                theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              } 100%)`,
            }}
          />
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: #10b981;
              border: 2px solid ${theme === 'dark' ? '#070B0E' : '#ffffff'};
              cursor: pointer;
              box-shadow: 0 0 10px rgba(16,185,129,0.5);
              transition: transform 0.1s, box-shadow 0.1s;
            }
            input[type=range]::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 0 15px rgba(16,185,129,0.8);
            }
          `}</style>
        </div>

        <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 mt-1 px-1 font-mono">
          <span>{sliderMin}</span>
          <span>{sliderMax}</span>
        </div>
      </div>

      <div className="w-full h-px bg-slate-300 dark:bg-white/5 transition-colors duration-500" />

      <div>
        <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
          Security Options
        </div>
        <GlassToggle
          checked={enforcePatternBlacklist}
          onChange={onEnforcePatternBlacklistChange}
          label="Pattern Blacklist"
          description="Blocks common passwords, sequences & keyboard patterns"
        />
        <GlassToggle
          checked={copyOnClick}
          onChange={onCopyOnClickChange}
          label="Copy on Click"
          description="Click the password display to copy instantly"
        />
      </div>

      <div className="w-full h-px bg-slate-300 dark:bg-white/5 transition-colors duration-500" />

      {mode === 'password' ? (
        <div>
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Character Types</div>
          <GlassToggle
            checked={includeUppercase}
            onChange={onIncludeUppercaseChange}
            label="Uppercase Letters"
          />
          <GlassToggle
            checked={includeLowercase}
            onChange={onIncludeLowercaseChange}
            label="Lowercase Letters"
          />
          <GlassToggle checked={includeNumbers} onChange={onIncludeNumbersChange} label="Numbers" />
          <GlassToggle checked={includeSymbols} onChange={onIncludeSymbolsChange} label="Symbols" />

          <div className="pt-1.5 mt-1.5 border-t border-slate-300 dark:border-white/5 transition-colors duration-500">
            <GlassToggle
              checked={avoidAmbiguous}
              onChange={onAvoidAmbiguousChange}
              label="Avoid ambiguous"
              description="Excludes l, 1, I, O, 0"
            />
          </div>

          <div
            className={`pt-1.5 transition-opacity duration-300 ${
              includeSymbols ? '' : 'opacity-40'
            }`}
          >
            <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
              Include custom symbols
            </label>
            <input
              type="text"
              value={customSymbols}
              disabled={!includeSymbols}
              onChange={(event) => onCustomSymbolsChange(event.target.value)}
              placeholder="e.g. !@#$%"
              className="w-full bg-white dark:bg-black/20 border border-slate-400 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm text-emerald-700 dark:text-emerald-400 font-mono focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-slate-500 dark:placeholder:text-slate-500 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-600 dark:text-slate-400 text-center px-4">
          Passphrase mode uses a {WORD_LIST.length}-word dictionary (~
          {Math.log2(WORD_LIST.length).toFixed(1)} bits per word) for memorable but secure
          passwords.
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-slate-300 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
      >
        <RotateCcw size={14} /> Reset to defaults
      </button>
    </aside>
  );
}
