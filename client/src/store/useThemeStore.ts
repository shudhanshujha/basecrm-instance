import { create } from 'zustand';

const STORAGE_KEY = 'bc_theme';

function getInitialMode(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored !== null) return stored === 'dark';
  return true;
}

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle('light', !isDark);
  document.documentElement.style.transition = 'color 0.25s ease, background-color 0.25s ease';
}

const initial = getInitialMode();
applyTheme(initial);

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: initial,
  toggleTheme: () => set((state) => {
    const nextMode = !state.isDarkMode;
    localStorage.setItem(STORAGE_KEY, nextMode ? 'dark' : 'light');
    applyTheme(nextMode);
    return { isDarkMode: nextMode };
  }),
}));
