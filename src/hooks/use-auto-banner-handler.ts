import { useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { detectBanner, clickElement, findElement, toggleCheckbox, type BannerMatchResult } from '@/lib/banner-patterns';
import type { UserPreferences, CookieCategories } from '@/lib/types';

export interface BannerClosedEvent {
  bannerName: string;
  timestamp: number;
  patternId: string;
}

interface AutoBannerHandlerProps {
  preferences: UserPreferences;
  onBannerClosed?: (event: BannerClosedEvent) => void;
  isEnabled: boolean;
}

export function useAutoBannerHandler({ preferences, onBannerClosed, isEnabled }: AutoBannerHandlerProps) {
  const timeoutRef = useRef<number>(0);
  const [customPatterns] = useKV<any[]>('custom-banner-patterns', []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleBanner = () => {
      try {
        const match = detectBanner(document);
        
        if (match && match.confidence > 30) {
          applyPreferencesToBanner(match, preferences, customPatterns || []);
          
          if (onBannerClosed) {
            onBannerClosed({
              bannerName: match.pattern.name,
              timestamp: Date.now(),
              patternId: match.pattern.id,
            });
          }
        }
      } catch (error) {
        console.error('Error handling banner:', error);
      }
    };

    const observer = new MutationObserver(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(handleBanner, 500);
    });

    handleBanner();

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [preferences, isEnabled, onBannerClosed, customPatterns]);
}

function applyPreferencesToBanner(
  match: BannerMatchResult,
  preferences: UserPreferences,
  customPatterns: any[]
) {
  const pattern = match.pattern;
  
  const categories: CookieCategories = preferences.useCustom && preferences.customCategories
    ? preferences.customCategories
    : getDefaultCategories(preferences.level);

  if (preferences.level === 'all' && !preferences.useCustom) {
    const acceptAll = findElement(pattern.selectors.acceptAll || []);
    if (acceptAll) {
      setTimeout(() => clickElement(acceptAll), 300);
      return;
    }
  }

  if (preferences.level === 'necessary' && !preferences.useCustom) {
    const rejectAll = findElement(pattern.selectors.rejectAll || []);
    if (rejectAll) {
      setTimeout(() => clickElement(rejectAll), 300);
      return;
    }
  }

  const settings = findElement(pattern.selectors.settings || []);
  if (settings) {
    clickElement(settings);
    
    setTimeout(() => {
      if (pattern.selectors.necessary) {
        toggleCheckbox(findElement(pattern.selectors.necessary), categories.necessary);
      }
      if (pattern.selectors.functional) {
        toggleCheckbox(findElement(pattern.selectors.functional), categories.functional);
      }
      if (pattern.selectors.analytics) {
        toggleCheckbox(findElement(pattern.selectors.analytics), categories.analytics);
      }
      if (pattern.selectors.marketing) {
        toggleCheckbox(findElement(pattern.selectors.marketing), categories.marketing);
      }

      const saveButton = findElement(pattern.selectors.saveSettings || []);
      if (saveButton) {
        setTimeout(() => clickElement(saveButton), 200);
      }
    }, 500);
  } else {
    const rejectAll = findElement(pattern.selectors.rejectAll || []);
    if (rejectAll) {
      setTimeout(() => clickElement(rejectAll), 300);
    }
  }
}

function getDefaultCategories(level: UserPreferences['level']): CookieCategories {
  switch (level) {
    case 'necessary':
      return { necessary: true, functional: false, analytics: false, marketing: false };
    case 'functional':
      return { necessary: true, functional: true, analytics: false, marketing: false };
    case 'analytics':
      return { necessary: true, functional: true, analytics: true, marketing: false };
    case 'all':
      return { necessary: true, functional: true, analytics: true, marketing: true };
  }
}
