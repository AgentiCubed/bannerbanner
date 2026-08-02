import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Gear, Eye, Info } from '@phosphor-icons/react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsDashboard } from '@/components/StatsDashboard';
import { BannerDemo } from '@/components/BannerDemo';
import type { PreferenceLevel, CookieCategories, UserPreferences } from '@/lib/types';

const DEFAULT_CATEGORIES: CookieCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

function App() {
  const [preferences, setPreferences] = useKV<UserPreferences>('banner-preferences', {
    level: 'necessary',
    useCustom: false,
    customCategories: DEFAULT_CATEGORIES,
  });

  const [showBanner, setShowBanner] = useState(false);

  const handlePreferenceLevelChange = (level: PreferenceLevel) => {
    setPreferences((current) => {
      if (!current) return { level, useCustom: false, customCategories: DEFAULT_CATEGORIES };
      return {
        ...current,
        level,
      };
    });
    toast.success('Privacy preference updated');
  };

  const handleUseCustomChange = (useCustom: boolean) => {
    setPreferences((current) => {
      if (!current) return { level: 'necessary', useCustom, customCategories: DEFAULT_CATEGORIES };
      return {
        ...current,
        useCustom,
      };
    });
  };

  const handleCustomCategoriesChange = (customCategories: CookieCategories) => {
    setPreferences((current) => {
      if (!current) return { level: 'necessary', useCustom: true, customCategories };
      return {
        ...current,
        customCategories,
      };
    });
  };

  const handleApplySettings = () => {
    setShowBanner(false);
    toast.success('Settings applied! Banner closed automatically.', {
      description: 'Your privacy preferences have been saved.',
    });
  };

  const handleShowDemo = () => {
    setShowBanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <ShieldCheck size={32} weight="duotone" className="text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">BannerBanner</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Automatically manage cookie consent banners with your privacy preferences
          </p>
        </header>

        <StatsDashboard
          preferenceLevel={preferences?.level ?? 'necessary'}
          useCustom={preferences?.useCustom ?? false}
          customCategories={preferences?.customCategories ?? DEFAULT_CATEGORIES}
        />

        <Tabs defaultValue="settings" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Gear size={18} weight="duotone" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye size={18} weight="duotone" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info size={18} weight="duotone" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card className="p-6">
              <SettingsPanel
                preferenceLevel={preferences?.level ?? 'necessary'}
                onPreferenceLevelChange={handlePreferenceLevelChange}
                useCustom={preferences?.useCustom ?? false}
                onUseCustomChange={handleUseCustomChange}
                customCategories={preferences?.customCategories ?? DEFAULT_CATEGORIES}
                onCustomCategoriesChange={handleCustomCategoriesChange}
              />
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Banner Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    See how BannerBanner would handle a typical cookie consent banner with your current settings.
                  </p>
                </div>

                <Alert>
                  <Info size={18} weight="duotone" />
                  <AlertDescription>
                    Click the button below to simulate a cookie banner. The "Apply My Settings" button will automatically close it using your configured preferences.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleShowDemo} disabled={showBanner}>
                    Show Cookie Banner
                  </Button>
                  {showBanner && (
                    <Button variant="outline" onClick={() => setShowBanner(false)}>
                      Hide Banner
                    </Button>
                  )}
                </div>

                <div className="p-6 rounded-lg bg-muted/30 border border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    {showBanner
                      ? 'Banner is visible below. Click "Apply My Settings" to close it automatically.'
                      : 'No banner currently showing. Click the button above to see the demo.'}
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="info">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      BannerBanner is designed to save you time and protect your privacy by automatically managing cookie consent banners based on your preferences.
                    </p>
                    <p>
                      Simply set your preferred privacy level once, and the extension would automatically apply those settings to cookie banners across the web, eliminating the need to manually configure each one.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Privacy Levels</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-medium">•</span>
                      <span><strong>Necessary Only:</strong> Maximum privacy - only essential cookies required for the site to function</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-medium">•</span>
                      <span><strong>Functional:</strong> Includes cookies that remember your preferences and settings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-medium">•</span>
                      <span><strong>Analytics:</strong> Allows anonymous usage data to help improve services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-medium">•</span>
                      <span><strong>All Cookies:</strong> Accept all cookies including marketing and tracking</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Advanced Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable advanced settings to have granular control over individual cookie categories. This overrides the preset privacy levels and lets you create a custom configuration that matches your exact preferences.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AnimatePresence>
        {showBanner && (
          <BannerDemo onApplySettings={handleApplySettings} isVisible={showBanner} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;