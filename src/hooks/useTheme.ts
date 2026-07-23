import { useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';
export type ColorTheme = 'emerald' | 'indigo' | 'purple' | 'amber' | 'rose';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('expense_tracker_theme_mode');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('expense_tracker_color_theme');
    const valid: ColorTheme[] = ['emerald', 'indigo', 'purple', 'amber', 'rose'];
    return valid.includes(saved as ColorTheme) ? (saved as ColorTheme) : 'emerald';
  });

  const [isGlass, setIsGlass] = useState<boolean>(() => {
    const saved = localStorage.getItem('expense_tracker_is_glass');
    return saved !== null ? saved === 'true' : true; // default enabled
  });

  useEffect(() => {
    const root = document.documentElement;

    // Dark / Light Mode
    if (mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    root.setAttribute('data-mode', mode);

    // Color Theme Accent
    root.setAttribute('data-color', colorTheme);

    // Glassmorphism Mode
    if (isGlass) {
      root.classList.add('glass-ui');
    } else {
      root.classList.remove('glass-ui');
    }

    localStorage.setItem('expense_tracker_theme_mode', mode);
    localStorage.setItem('expense_tracker_color_theme', colorTheme);
    localStorage.setItem('expense_tracker_is_glass', String(isGlass));
  }, [mode, colorTheme, isGlass]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleGlass = () => {
    setIsGlass((prev) => !prev);
  };

  return {
    mode,
    setMode,
    toggleMode,
    colorTheme,
    setColorTheme,
    isGlass,
    setIsGlass,
    toggleGlass,
    // legacy backward compatibility props
    theme: mode,
    toggleTheme: toggleMode,
  };
}
