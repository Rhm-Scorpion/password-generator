interface GlassToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}

export function GlassToggle({ checked, onChange, label, description }: GlassToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between py-1.5 [@media(min-height:900px)]:py-2 cursor-pointer group text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
    >
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{description}</span>
        )}
      </div>
      <div
        className={`relative w-10 h-5 shrink-0 ml-4 rounded-full transition-colors duration-300 ease-in-out border ${
          checked
            ? 'bg-emerald-500 border-emerald-400'
            : 'bg-slate-300 dark:bg-white/5 border-slate-400 dark:border-white/10'
        }`}
      >
        <div
          className={`absolute left-0.5 top-0.5 bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 ease-in-out ${
            checked
              ? 'translate-x-5 shadow-[0_0_10px_rgba(255,255,255,0.8)]'
              : 'translate-x-0 opacity-70'
          } shadow-sm`}
        />
      </div>
    </button>
  );
}
