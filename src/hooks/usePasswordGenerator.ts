import { useCallback, useEffect, useRef, useState } from 'react';
import { generateSecret } from '../lib/generator';
import type { GeneratorMode, GeneratorOptions } from '../lib/types';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';

export function usePasswordGenerator(options: GeneratorOptions) {
  const [password, setPassword] = useState('');
  const [displayedPassword, setDisplayedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generatingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const optionsRef = useRef(options);

  optionsRef.current = options;

  const runGenerationAnimation = useCallback((newPassword: string) => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    let iter = 0;
    animationIntervalRef.current = setInterval(() => {
      setDisplayedPassword(
        newPassword
          .split('')
          .map((char, index) =>
            index < iter ? char : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
          )
          .join(''),
      );
      iter++;
      if (iter > newPassword.length) {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
        setDisplayedPassword(newPassword);
      }
    }, 32);
  }, []);

  const generatePassword = useCallback(() => {
    setIsGenerating(true);
    if (generatingTimeoutRef.current) {
      clearTimeout(generatingTimeoutRef.current);
    }
    generatingTimeoutRef.current = setTimeout(() => setIsGenerating(false), 300);

    const newPassword = generateSecret(optionsRef.current);
    setPassword(newPassword);
    runGenerationAnimation(newPassword);
  }, [runGenerationAnimation]);

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      if (generatingTimeoutRef.current) clearTimeout(generatingTimeoutRef.current);
    };
  }, []);

  return {
    password,
    displayedPassword,
    isGenerating,
    generatePassword,
  };
}

export type { GeneratorMode, GeneratorOptions };
