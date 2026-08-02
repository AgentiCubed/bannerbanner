export type PreferenceLevel = 'necessary' | 'functional' | 'analytics' | 'all';

export interface CookieCategories {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface UserPreferences {
  level: PreferenceLevel;
  customCategories?: CookieCategories;
  useCustom: boolean;
}
