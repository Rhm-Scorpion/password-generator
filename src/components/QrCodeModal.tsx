import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import QRCode from 'qrcode';

interface QrCodeModalProps {
  password: string;
  open: boolean;
  onClose: () => void;
}

export function QrCodeModal({ password, open, onClose }: QrCodeModalProps) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!open || !password) {
      // Drop the previous QR so a stale code never flashes on reopen.
      setDataUrl('');
      return;
    }

    let cancelled = false;
    QRCode.toDataURL(password, { width: 260, margin: 1 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch((err) => console.error('Failed to render QR code:', err));

    return () => {
      cancelled = true;
    };
  }, [open, password]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Password QR code"
    >
      <div
        className="bg-white dark:bg-[#0B1014] border border-slate-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
            Scan to transfer
          </span>
          <button
            onClick={onClose}
            autoFocus
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {dataUrl ? (
          <img src={dataUrl} alt="QR code containing the generated password" className="rounded-lg" />
        ) : (
          <div className="w-[260px] h-[260px] rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
        )}

        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center leading-relaxed">
          The QR code contains your password in plain text and is generated locally.
          Make sure no one can see your screen.
        </p>
      </div>
    </div>
  );
}
