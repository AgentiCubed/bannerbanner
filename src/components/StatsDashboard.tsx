import { Card } from '@/components/ui/card';
import { ShieldCheck, CheckCircle, Clock } from '@phosphor-icons/react';
import type { PreferenceLevel, CookieCategories } from '@/lib/types';

interface StatsDashboardProps {
  preferenceLevel: PreferenceLevel;
  useCustom: boolean;
  customCategories: CookieCategories;
}

export function StatsDashboard({ preferenceLevel, useCustom, customCategories }: StatsDashboardProps) {
  const activeCategories = useCustom
    ? Object.values(customCategories).filter(Boolean).length
    : getLevelCategories(preferenceLevel);

  const privacyScore = Math.round((1 - (activeCategories - 1) / 3) * 100);
  
  const estimatedTimeSaved = 45;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-accent/10">
            <ShieldCheck size={24} weight="duotone" className="text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Privacy Level</p>
            <p className="text-2xl font-bold">{privacyScore}%</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {privacyScore >= 75 ? 'Excellent protection' : privacyScore >= 50 ? 'Good protection' : 'Moderate protection'}
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <CheckCircle size={24} weight="duotone" className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Active Categories</p>
            <p className="text-2xl font-bold">{activeCategories} / 4</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {getActiveCategoriesLabel(activeCategories)}
        </p>
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Clock size={24} weight="duotone" className="text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time Saved</p>
            <p className="text-2xl font-bold">~{estimatedTimeSaved}s</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Per session estimate</p>
      </Card>
    </div>
  );
}

function getLevelCategories(level: PreferenceLevel): number {
  switch (level) {
    case 'necessary':
      return 1;
    case 'functional':
      return 2;
    case 'analytics':
      return 3;
    case 'all':
      return 4;
  }
}

function getActiveCategoriesLabel(count: number): string {
  switch (count) {
    case 1:
      return 'Necessary only';
    case 2:
      return 'Including functional';
    case 3:
      return 'Including analytics';
    case 4:
      return 'All categories enabled';
    default:
      return 'No categories';
  }
}
