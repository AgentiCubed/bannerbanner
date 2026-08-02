import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useKV } from '@github/spark/hooks';
import { THEME_COLORS, type ThemeName } from '@/lib/theme-config';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useKV<ThemeName>('app-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    const colors = THEME_COLORS[theme || 'light'];

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme: theme || 'light', setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
