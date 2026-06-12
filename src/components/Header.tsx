import { Moon, ShieldCheck, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="h-14 w-full bg-white dark:bg-white/[0.02] backdrop-blur-[12px] border-b border-slate-300 dark:border-white/[0.05] flex items-center justify-between px-6 z-20 shrink-0 transition-colors duration-500">
      <div className="flex items-center gap-3 text-slate-900 dark:text-slate-200 font-medium tracking-wide">
        <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-500" />
        <span className="text-sm font-semibold dark:font-medium">Security Suite</span>
        <span className="hidden sm:inline-flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] uppercase tracking-widest font-bold border border-emerald-200 dark:border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Secure · Local · Zero-Leak
        </span>
      </div>
      <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400 font-medium">
        <button
          onClick={onToggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.1] hover:bg-slate-200 dark:hover:bg-white/[0.1] transition-all focus:outline-none text-slate-700 dark:text-slate-200 shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-indigo-500" />
          )}
          <span className="text-xs font-bold tracking-wide uppercase">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>
    </header>
  );
}
