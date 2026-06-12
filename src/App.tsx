import { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Hash, KeyRound, Lock, RefreshCw, Shield, Zap } from 'lucide-react';
import { Header } from './components/Header';
import { OptionsPanel } from './components/OptionsPanel';
import { PasswordDisplay } from './components/PasswordDisplay';
import { QrCodeModal } from './components/QrCodeModal';
import { StatsPanel } from './components/StatsPanel';
import { useClipboard } from './hooks/useClipboard';
import { usePasswordGenerator } from './hooks/usePasswordGenerator';
import { isBlacklisted } from './lib/blacklist';
import {
  calculateCharsetSize,
  calculateEntropyBits,
  formatCrackTime,
  strengthFromEntropy,
} from './lib/entropy';
import { DEFAULT_CONFIG, PRESETS, type PresetConfig } from './lib/presets';

const PRESET_ICONS: Record<string, typeof Hash> = {
  pin: Hash,
  memorable: BookOpen,
  strong: Shield,
  maximum: Zap,
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [config, setConfig] = useState<PresetConfig>(DEFAULT_CONFIG);
  const [enforcePatternBlacklist, setEnforcePatternBlacklist] = useState(true);
  const [copyOnClick, setCopyOnClick] = useState(true);
  const [qrOpen, setQrOpen] = useState(false);

  const {
    mode,
    length,
    wordCount,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    avoidAmbiguous,
    customSymbols,
  } = config;

  const generatorOptions = useMemo(
    () => ({
      mode,
      password: {
        length,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols,
        avoidAmbiguous,
        customSymbols,
      },
      passphrase: { wordCount },
      enforcePatternBlacklist,
    }),
    [
      mode,
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
      avoidAmbiguous,
      customSymbols,
      wordCount,
      enforcePatternBlacklist,
    ],
  );

  const { password, displayedPassword, isGenerating, generatePassword } =
    usePasswordGenerator(generatorOptions);

  const { copyState, copyToClipboard } = useClipboard();

  useEffect(() => {
    generatePassword();
  }, []);

  const handleCopy = useCallback(() => {
    copyToClipboard(password);
  }, [copyToClipboard, password]);

  const regenerate = useCallback(() => {
    setTimeout(generatePassword, 0);
  }, [generatePassword]);

  const updateConfig = useCallback(
    (patch: Partial<PresetConfig>) => {
      setConfig((current) => ({ ...current, ...patch }));
      regenerate();
    },
    [regenerate],
  );

  const charsetSize = calculateCharsetSize({
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    avoidAmbiguous,
    customSymbols,
  });

  const entropyBits = calculateEntropyBits(mode, password, {
    length,
    wordCount,
    charsetSize,
  });

  const strength = strengthFromEntropy(entropyBits);
  const crackTimeLabel = formatCrackTime(entropyBits);
  const patternFree = Boolean(password) && !isBlacklisted(password);

  return (
    <div
      className={`${theme} min-h-screen bg-slate-100 dark:bg-[#070B0E] text-slate-900 dark:text-slate-300 font-sans overflow-hidden flex flex-col relative selection:bg-emerald-500/30 transition-colors duration-500`}
    >
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[40%] w-[30%] h-[30%] bg-emerald-400/5 rounded-full blur-[100px] pointer-events-none" />

      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />

      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden z-10 p-4 gap-4 max-w-[1600px] mx-auto w-full">
        <aside className="w-full lg:w-64 shrink-0 bg-white dark:bg-white/[0.03] backdrop-blur-[20px] border border-slate-300 dark:border-white/[0.05] rounded-2xl p-4 flex flex-col gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-colors duration-500">
          <div className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold dark:font-medium border border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]">
            <KeyRound size={16} /> Generator
          </div>

          <div>
            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2 px-1">
              Presets
            </div>
            <div className="flex flex-col gap-1 [@media(min-height:900px)]:gap-2">
              {PRESETS.map((preset) => {
                const Icon = PRESET_ICONS[preset.id] ?? Shield;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setConfig(preset.config);
                      regenerate();
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-left text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
                  >
                    <Icon size={15} className="text-emerald-600 dark:text-emerald-500 shrink-0" />
                    <span className="flex flex-col">
                      <span className="text-sm font-medium leading-tight">{preset.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {preset.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-3 flex items-start gap-2.5">
              <Lock size={14} className="text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-200">
                  Your data stays private
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Everything is generated locally in your browser. Nothing is ever sent anywhere.
                </div>
              </div>
            </div>
            <div className="px-1 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
              v2.0.0
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <main className="flex-1 bg-white dark:bg-white/[0.02] backdrop-blur-[40px] border border-slate-300 dark:border-white/[0.08] rounded-2xl flex flex-col relative overflow-hidden shadow-[inset_0_0_80px_rgba(16,185,129,0.03),0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_80px_rgba(16,185,129,0.03),0_8px_32px_rgba(0,0,0,0.4)] transition-colors duration-500">
            <div
              className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative z-10">
              <div className="flex flex-col items-center gap-5 w-full max-w-4xl justify-center">
                <div className="text-center mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Password Generator
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                    Cryptographically secure passwords, generated locally in your browser.
                  </p>
                </div>

                <PasswordDisplay
                  displayedPassword={displayedPassword}
                  isGenerating={isGenerating}
                  copyState={copyState}
                  copyOnClick={copyOnClick}
                  strength={strength}
                  onCopy={handleCopy}
                  onShowQr={() => setQrOpen(true)}
                />

                <StatsPanel
                  entropyBits={entropyBits}
                  crackTimeLabel={crackTimeLabel}
                  password={password}
                  mode={mode}
                  patternFree={patternFree}
                />

                <button
                  onClick={generatePassword}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-500 hover:bg-emerald-400 flex flex-col items-center justify-center text-white dark:text-[#070B0E] shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 active:opacity-80 shrink-0 group focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                >
                  <RefreshCw
                    size={24}
                    className={`mb-1 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}
                  />
                  <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                    Generate
                  </span>
                </button>
              </div>
            </div>
          </main>
        </div>

        <OptionsPanel
          theme={theme}
          mode={mode}
          onModeChange={(value) => updateConfig({ mode: value })}
          length={length}
          wordCount={wordCount}
          includeUppercase={includeUppercase}
          includeLowercase={includeLowercase}
          includeNumbers={includeNumbers}
          includeSymbols={includeSymbols}
          avoidAmbiguous={avoidAmbiguous}
          customSymbols={customSymbols}
          enforcePatternBlacklist={enforcePatternBlacklist}
          copyOnClick={copyOnClick}
          onLengthChange={(value) => updateConfig({ length: value })}
          onWordCountChange={(value) => updateConfig({ wordCount: value })}
          onIncludeUppercaseChange={(value) => updateConfig({ includeUppercase: value })}
          onIncludeLowercaseChange={(value) => updateConfig({ includeLowercase: value })}
          onIncludeNumbersChange={(value) => updateConfig({ includeNumbers: value })}
          onIncludeSymbolsChange={(value) => updateConfig({ includeSymbols: value })}
          onAvoidAmbiguousChange={(value) => updateConfig({ avoidAmbiguous: value })}
          onCustomSymbolsChange={(value) => updateConfig({ customSymbols: value })}
          onEnforcePatternBlacklistChange={(value) => {
            setEnforcePatternBlacklist(value);
            regenerate();
          }}
          onCopyOnClickChange={setCopyOnClick}
          onReset={() => {
            setConfig(DEFAULT_CONFIG);
            setEnforcePatternBlacklist(true);
            setCopyOnClick(true);
            regenerate();
          }}
        />
      </div>

      <QrCodeModal password={password} open={qrOpen} onClose={() => setQrOpen(false)} />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
        }
      `}</style>
    </div>
  );
}
