import { AlertCircle, Check, Copy, QrCode } from 'lucide-react';
import type { CopyState } from '../hooks/useClipboard';
import type { StrengthResult } from '../lib/types';

interface PasswordDisplayProps {
  displayedPassword: string;
  isGenerating: boolean;
  copyState: CopyState;
  copyOnClick: boolean;
  strength: StrengthResult;
  onCopy: () => void;
  onShowQr: () => void;
}

const ICON_BUTTON_CLASS =
  'p-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/[0.05] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.1] hover:text-slate-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50';

export function PasswordDisplay({
  displayedPassword,
  isGenerating,
  copyState,
  copyOnClick,
  strength,
  onCopy,
  onShowQr,
}: PasswordDisplayProps) {
  return (
    <div className="w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] px-5 py-4 transition-colors duration-500">
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Generated Password
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 shrink-0 hidden sm:block" aria-hidden="true" />
        <div
          className={`flex-1 min-w-0 ${copyOnClick ? 'cursor-pointer group' : 'cursor-default'}`}
          onClick={copyOnClick ? onCopy : undefined}
          title={copyOnClick ? 'Click to copy' : undefined}
          role={copyOnClick ? 'button' : undefined}
          tabIndex={copyOnClick ? 0 : undefined}
          onKeyDown={(event) => {
            if (copyOnClick && (event.key === 'Enter' || event.key === ' ')) {
              event.preventDefault();
              onCopy();
            }
          }}
        >
          <div
            className={`text-2xl sm:text-3xl md:text-4xl font-mono font-bold dark:font-normal text-emerald-700 dark:text-emerald-400 tracking-tight break-all text-center drop-shadow-none dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] ${
              copyOnClick
                ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-300 dark:group-hover:drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]'
                : ''
            } transition-all duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
          >
            {displayedPassword || 'Generating...'}
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={onCopy} className={ICON_BUTTON_CLASS} title="Copy to clipboard">
            {copyState === 'copied' && (
              <Check size={18} className="text-emerald-500 dark:text-emerald-400" />
            )}
            {copyState === 'failed' && <AlertCircle size={18} className="text-red-500" />}
            {copyState === 'idle' && <Copy size={18} />}
          </button>
          <button onClick={onShowQr} className={ICON_BUTTON_CLASS} title="Show QR code">
            <QrCode size={18} />
          </button>
        </div>
      </div>

      <div
        className={`mt-2 text-center text-[10px] uppercase tracking-widest transition-all ${
          copyState === 'copied'
            ? 'text-emerald-500 dark:text-emerald-400'
            : copyState === 'failed'
              ? 'text-red-500'
              : 'text-slate-500 dark:text-slate-400 opacity-60'
        }`}
      >
        {copyState === 'copied'
          ? 'Copied to clipboard'
          : copyState === 'failed'
            ? 'Copy failed'
            : copyOnClick
              ? 'Click the password to copy'
              : '\u00A0'}
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-1 h-1.5 flex-1">
          {[1, 2, 3, 4, 5].map((segment) => (
            <div
              key={segment}
              className={`flex-1 rounded-full transition-colors duration-500 ease-out ${
                segment <= strength.score ? strength.color : 'bg-slate-300 dark:bg-white/10'
              }`}
            />
          ))}
        </div>
        <span className={`text-[10px] font-bold tracking-wider shrink-0 ${strength.text}`}>
          {strength.label}
        </span>
      </div>
    </div>
  );
}
