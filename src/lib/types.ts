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

export type TestStatus = 'untested' | 'working' | 'failed' | 'partial';

export interface TestResult {
  url: string;
  status: TestStatus;
  timestamp: number;
  notes?: string;
  attemptCount: number;
  lastAttemptTimestamp?: number;
  successCount: number;
  failureCount: number;
  bannerDetected: boolean;
  bannerClosed: boolean;
  cookiesVerified: boolean;
}

export interface TestSite {
  name: string;
  url: string;
  bannerType: string;
  description: string;
  testResult?: TestResult;
}
