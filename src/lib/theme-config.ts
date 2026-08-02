export type ThemeName = 'light' | 'dark' | 'banana';

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
    background: 'oklch(0.95 0.08 95)',
    foreground: 'oklch(0.25 0.05 60)',
    card: 'oklch(0.98 0.05 90)',
    cardForeground: 'oklch(0.25 0.05 60)',
    popover: 'oklch(1 0.02 85)',
    popoverForeground: 'oklch(0.25 0.05 60)',
    primary: 'oklch(0.7 0.18 85)',
    primaryForeground: 'oklch(0.2 0.05 60)',
    secondary: 'oklch(0.45 0.08 75)',
    secondaryForeground: 'oklch(0.98 0.05 90)',
    muted: 'oklch(0.9 0.06 90)',
    mutedForeground: 'oklch(0.5 0.06 70)',
    accent: 'oklch(0.75 0.2 90)',
    accentForeground: 'oklch(0.2 0.05 60)',
    destructive: 'oklch(0.55 0.22 25)',
    destructiveForeground: 'oklch(1 0 0)',
    border: 'oklch(0.85 0.08 88)',
    input: 'oklch(0.85 0.08 88)',
    ring: 'oklch(0.75 0.2 90)',
  },
};
