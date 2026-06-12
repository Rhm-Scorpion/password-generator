import { useCallback, useEffect, useRef, useState } from 'react';

const CLIPBOARD_CLEAR_MS = 30_000;
const FEEDBACK_MS = 2_000;

export type CopyState = 'idle' | 'copied' | 'failed';

export function useClipboard() {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const clipboardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCopiedRef = useRef('');

  const scheduleClipboardClear = useCallback(() => {
    if (clipboardTimeoutRef.current) {
      clearTimeout(clipboardTimeoutRef.current);
    }

    clipboardTimeoutRef.current = setTimeout(async () => {
      try {
        // Don't wipe the clipboard if the user copied something else meanwhile.
        const current = await navigator.clipboard.readText();
        if (current !== lastCopiedRef.current) return;
      } catch {
        // Can't verify contents (permissions / unfocused tab) — clear anyway, security first.
      }
      navigator.clipboard.writeText('').catch(() => {
        // Tab lost focus; the password stays on the clipboard but we can't help it.
      });
    }, CLIPBOARD_CLEAR_MS);
  }, []);

  const showFeedback = useCallback((state: CopyState) => {
    setCopyState(state);
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    feedbackTimeoutRef.current = setTimeout(() => setCopyState('idle'), FEEDBACK_MS);
  }, []);

  const copyToClipboard = useCallback(
    async (textToCopy: string) => {
      if (!textToCopy) return false;

      try {
        await navigator.clipboard.writeText(textToCopy);
        lastCopiedRef.current = textToCopy;
        showFeedback('copied');
        scheduleClipboardClear();
        return true;
      } catch (err) {
        console.error('Failed to copy!', err);
        showFeedback('failed');
        return false;
      }
    },
    [scheduleClipboardClear, showFeedback],
  );

  useEffect(() => {
    return () => {
      if (clipboardTimeoutRef.current) clearTimeout(clipboardTimeoutRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return { copyState, copyToClipboard };
}
