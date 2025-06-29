'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import { setTheme, type Theme } from '@/lib/features/preferences/preferencesSlice';

export default function ThemeManager() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return null;
}
