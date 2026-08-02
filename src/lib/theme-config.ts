export type ThemeName = 'light' | 'dark' | 'banana' | 'dark-banana';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export const THEME_COLORS: Record<ThemeName, ThemeColors> = {
  light: {
    background: 'oklch(0.98 0 0)',
    foreground: 'oklch(0.25 0.02 255)',
    card: 'oklch(0.96 0.01 255)',
    cardForeground: 'oklch(0.25 0.02 255)',
    popover: 'oklch(1 0 0)',
    popoverForeground: 'oklch(0.25 0.02 255)',
    primary: 'oklch(0.45 0.15 255)',
    primaryForeground: 'oklch(1 0 0)',
    secondary: 'oklch(0.35 0.02 255)',
    secondaryForeground: 'oklch(0.96 0.01 255)',
    muted: 'oklch(0.92 0.01 255)',
    mutedForeground: 'oklch(0.5 0.02 255)',
    accent: 'oklch(0.65 0.14 200)',
    accentForeground: 'oklch(0.25 0.02 255)',
    destructive: 'oklch(0.55 0.22 25)',
    destructiveForeground: 'oklch(1 0 0)',
    border: 'oklch(0.88 0.01 255)',
    input: 'oklch(0.88 0.01 255)',
    ring: 'oklch(0.65 0.14 200)',
  },
  dark: {
    background: 'oklch(0.15 0.01 255)',
    foreground: 'oklch(0.95 0.01 255)',
    card: 'oklch(0.18 0.01 255)',
    cardForeground: 'oklch(0.95 0.01 255)',
    popover: 'oklch(0.18 0.01 255)',
    popoverForeground: 'oklch(0.95 0.01 255)',
    primary: 'oklch(0.65 0.18 255)',
    primaryForeground: 'oklch(0.15 0.01 255)',
    secondary: 'oklch(0.25 0.02 255)',
    secondaryForeground: 'oklch(0.95 0.01 255)',
    muted: 'oklch(0.22 0.01 255)',
    mutedForeground: 'oklch(0.65 0.01 255)',
    accent: 'oklch(0.7 0.16 180)',
    accentForeground: 'oklch(0.15 0.01 255)',
    destructive: 'oklch(0.6 0.24 25)',
    destructiveForeground: 'oklch(0.95 0.01 255)',
    border: 'oklch(0.28 0.01 255)',
    input: 'oklch(0.28 0.01 255)',
    ring: 'oklch(0.7 0.16 180)',
  },
  banana: {
    background: 'oklch(0.96 0.10 92)',
    foreground: 'oklch(0.22 0.06 65)',
    card: 'oklch(0.99 0.06 88)',
    cardForeground: 'oklch(0.22 0.06 65)',
    popover: 'oklch(1 0.03 85)',
    popoverForeground: 'oklch(0.22 0.06 65)',
    primary: 'oklch(0.68 0.20 88)',
    primaryForeground: 'oklch(0.18 0.06 65)',
    secondary: 'oklch(0.42 0.10 78)',
    secondaryForeground: 'oklch(0.99 0.06 88)',
    muted: 'oklch(0.92 0.08 90)',
    mutedForeground: 'oklch(0.48 0.08 72)',
    accent: 'oklch(0.78 0.22 92)',
    accentForeground: 'oklch(0.18 0.06 65)',
    destructive: 'oklch(0.55 0.22 25)',
    destructiveForeground: 'oklch(1 0 0)',
    border: 'oklch(0.83 0.10 88)',
    input: 'oklch(0.83 0.10 88)',
    ring: 'oklch(0.78 0.22 92)',
  },
  'dark-banana': {
    background: 'oklch(0.16 0.05 72)',
    foreground: 'oklch(0.96 0.07 95)',
    card: 'oklch(0.20 0.06 76)',
    cardForeground: 'oklch(0.96 0.07 95)',
    popover: 'oklch(0.20 0.06 76)',
    popoverForeground: 'oklch(0.96 0.07 95)',
    primary: 'oklch(0.78 0.22 88)',
    primaryForeground: 'oklch(0.14 0.05 72)',
    secondary: 'oklch(0.32 0.09 78)',
    secondaryForeground: 'oklch(0.96 0.07 95)',
    muted: 'oklch(0.26 0.06 76)',
    mutedForeground: 'oklch(0.70 0.10 88)',
    accent: 'oklch(0.82 0.24 92)',
    accentForeground: 'oklch(0.14 0.05 72)',
    destructive: 'oklch(0.60 0.24 25)',
    destructiveForeground: 'oklch(0.96 0.07 95)',
    border: 'oklch(0.30 0.07 76)',
    input: 'oklch(0.30 0.07 76)',
    ring: 'oklch(0.82 0.24 92)',
  },
};
