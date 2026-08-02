import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Cookie, ShieldCheck, ChartBar, Target } from '@phosphor-icons/react';
import type { PreferenceLevel, CookieCategories } from '@/lib/types';

interface SettingsPanelProps {
  preferenceLevel: PreferenceLevel;
  onPreferenceLevelChange: (level: PreferenceLevel) => void;
  useCustom: boolean;
  onUseCustomChange: (value: boolean) => void;
  customCategories: CookieCategories;
  onCustomCategoriesChange: (categories: CookieCategories) => void;
}

export function SettingsPanel({
  preferenceLevel,
  onPreferenceLevelChange,
  useCustom,
  onUseCustomChange,
  customCategories,
  onCustomCategoriesChange,
}: SettingsPanelProps) {
  const activeCount = Object.values(customCategories).filter(Boolean).length;

  const preferenceLevels = [
    {
      value: 'necessary' as const,
      label: 'Necessary Only',
      description: 'Maximum privacy - only essential cookies',
      icon: ShieldCheck,
    },
    {
      value: 'functional' as const,
      label: 'Functional',
      description: 'Necessary + functional cookies for better UX',
      icon: Target,
    },
    {
      value: 'analytics' as const,
      label: 'Analytics',
      description: 'Includes analytics to improve services',
      icon: ChartBar,
    },
    {
      value: 'all' as const,
      label: 'All Cookies',
      description: 'Accept all cookies including marketing',
      icon: Cookie,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Default Privacy Level</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose your default cookie preference. This will be applied to all cookie banners.
        </p>
        
        <RadioGroup value={preferenceLevel} onValueChange={onPreferenceLevelChange}>
          <div className="grid gap-3">
            {preferenceLevels.map((level) => {
              const Icon = level.icon;
              return (
                <Label
                  key={level.value}
                  htmlFor={level.value}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-accent/50 ${
                    preferenceLevel === level.value
                      ? 'border-accent bg-accent/5'
                      : 'border-border'
                  }`}
                >
                  <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                  <Icon size={20} weight="duotone" className="mt-0.5 shrink-0 text-accent" />
                  <div className="flex-1">
                    <div className="font-medium mb-1">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </div>
                </Label>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Advanced Settings</h3>
            <p className="text-sm text-muted-foreground">
              Customize individual cookie categories
            </p>
          </div>
          <Switch
            checked={useCustom}
            onCheckedChange={onUseCustomChange}
            id="use-custom"
          />
        </div>

        {useCustom && (
          <Card className="p-4 space-y-4 border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Categories</span>
              <Badge variant="secondary">{activeCount} / 4</Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="necessary" className="font-medium">
                    Necessary Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">Required for site functionality</p>
                </div>
                <Switch
                  checked={customCategories.necessary}
                  onCheckedChange={(checked) =>
                    onCustomCategoriesChange({ ...customCategories, necessary: checked })
                  }
                  id="necessary"
                  disabled
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="functional" className="font-medium">
                    Functional Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">Remember preferences and settings</p>
                </div>
                <Switch
                  checked={customCategories.functional}
                  onCheckedChange={(checked) =>
                    onCustomCategoriesChange({ ...customCategories, functional: checked })
                  }
                  id="functional"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="font-medium">
                    Analytics Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">Help us improve our services</p>
                </div>
                <Switch
                  checked={customCategories.analytics}
                  onCheckedChange={(checked) =>
                    onCustomCategoriesChange({ ...customCategories, analytics: checked })
                  }
                  id="analytics"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="marketing" className="font-medium">
                    Marketing Cookies
                  </Label>
                  <p className="text-sm text-muted-foreground">Personalized ads and tracking</p>
                </div>
                <Switch
                  checked={customCategories.marketing}
                  onCheckedChange={(checked) =>
                    onCustomCategoriesChange({ ...customCategories, marketing: checked })
                  }
                  id="marketing"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
