import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Gear, Eye, Info, ListChecks, GraduationCap, Power, Palette } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeSelector } from '@/components/ThemeSelector';
import { SettingsPanel } from '@/components/SettingsPanel';
import { StatsDashboard } from '@/components/StatsDashboard';
import { BannerPatternsList } from '@/components/BannerPatternsList';
import { BananaCelebration } from '@/components/BananaCelebration';
import { LearnBannerPattern } from '@/components/LearnBannerPattern';
import { GhostBannerPreview } from '@/components/GhostBannerPreview';
import { BannerTrainerEnhanced } from '@/components/BannerTrainerEnhanced';
import { useAutoBannerHandler, type BannerClosedEvent } from '@/hooks/use-auto-banner-handler';
import { BANNER_PATTERNS } from '@/lib/banner-patterns';
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

  const [autoCloseEnabled, setAutoCloseEnabled] = useKV<boolean>('auto-close-enabled', true);
  const [showBanana, setShowBanana] = useKV<boolean>('show-banana-celebration', true);
  const [bananaVisible, setBananaVisible] = useState(false);
  const [lastBannerClosed, setLastBannerClosed] = useState<BannerClosedEvent | null>(null);
  const [isPreviewRunning, setIsPreviewRunning] = useState(false);
  const [sharePublicly, setSharePublicly] = useKV<boolean>('share-patterns-publicly', false);

  const handleBannerClosed = (event: BannerClosedEvent) => {
    setLastBannerClosed(event);
    if (showBanana) {
      setBananaVisible(true);
      setTimeout(() => setBananaVisible(false), 3500);
    }
  };

  useAutoBannerHandler({
    preferences: preferences || { level: 'necessary', useCustom: false, customCategories: DEFAULT_CATEGORIES },
    onBannerClosed: handleBannerClosed,
    isEnabled: autoCloseEnabled || false,
  });

  useEffect(() => {
    if (bananaVisible) {
      const timer = setTimeout(() => setBananaVisible(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [bananaVisible]);

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

  return (
    <ThemeProvider>
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
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-6">
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Gear size={18} weight="duotone" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette size={18} weight="duotone" />
                <span className="hidden sm:inline">Theme</span>
              </TabsTrigger>
              <TabsTrigger value="patterns" className="flex items-center gap-2">
                <ListChecks size={18} weight="duotone" />
                <span className="hidden sm:inline">Patterns</span>
              </TabsTrigger>
              <TabsTrigger value="learn" className="flex items-center gap-2">
                <GraduationCap size={18} weight="duotone" />
                <span className="hidden sm:inline">Learn</span>
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
            <Card className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-3">
                  <Power size={24} weight="duotone" className={autoCloseEnabled ? 'text-accent' : 'text-muted-foreground'} />
                  <div>
                    <Label htmlFor="auto-close" className="font-semibold cursor-pointer">
                      Automatic Banner Closing
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {autoCloseEnabled ? 'Banners will be closed automatically' : 'Banners must be closed manually'}
                    </p>
                  </div>
                </div>
                <Switch
                  id="auto-close"
                  checked={autoCloseEnabled || false}
                  onCheckedChange={(checked) => {
                    setAutoCloseEnabled(checked);
                    toast.success(checked ? 'Automatic closing enabled' : 'Automatic closing disabled');
                  }}
                />
              </div>

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

          <TabsContent value="appearance">
            <Card className="p-6">
              <ThemeSelector />
            </Card>
          </TabsContent>

          <TabsContent value="patterns">
            <Card className="p-6">
              <BannerPatternsList />
            </Card>
          </TabsContent>

          <TabsContent value="learn">
            <Card className="p-6">
              <LearnBannerPattern />
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Behind-the-Scenes Preview</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Watch how BannerBanner handles cookie banners automatically - no interaction required from you!
                    </p>
                  </div>

                  <Alert>
                    <Info size={18} weight="duotone" />
                    <AlertDescription>
                      This preview shows what happens behind the scenes when BannerBanner encounters a cookie banner. In real use, you'd never see the banner - it's detected and closed automatically before interrupting your browsing.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => {
                        setIsPreviewRunning(true);
                        setTimeout(() => setIsPreviewRunning(false), 6000);
                      }} 
                      disabled={isPreviewRunning}
                    >
                      {isPreviewRunning ? 'Running...' : 'Start Preview'}
                    </Button>
                    {isPreviewRunning && (
                      <Button variant="outline" onClick={() => setIsPreviewRunning(false)}>
                        Stop
                      </Button>
                    )}
                  </div>

                  <GhostBannerPreview
                    isRunning={isPreviewRunning}
                    preferenceLevel={preferences?.level ?? 'necessary'}
                    customCategories={preferences?.customCategories}
                    useCustom={preferences?.useCustom ?? false}
                  />
                </div>
              </Card>

              <BannerTrainerEnhanced
                onComplete={() => {
                  toast.success('Banner pattern saved successfully!', {
                    description: sharePublicly ? 'Pattern shared with the community' : 'Pattern saved locally',
                  });
                }}
                sharePublicly={sharePublicly || false}
                onSharePubliclyChange={(value: boolean) => setSharePublicly(value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="info">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How It Works</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      BannerBanner automatically detects and closes cookie consent banners based on your preferences - no clicking required!
                    </p>
                    <p>
                      When a banner is detected, the system applies your settings instantly. If you have automatic closing enabled, you'll see a delightful banana celebration when a banner is successfully removed.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
                  <div>
                    <Label htmlFor="show-banana" className="font-semibold cursor-pointer">
                      Show Banana Celebration
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Display a fun banana animation when banners are closed
                    </p>
                  </div>
                  <Switch
                    id="show-banana"
                    checked={showBanana || false}
                    onCheckedChange={(checked) => {
                      setShowBanana(checked);
                      if (checked) {
                        setBananaVisible(true);
                      }
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Supported Frameworks</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    BannerBanner recognizes {BANNER_PATTERNS.length} different cookie consent implementations, including:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ListChecks size={16} weight="duotone" className="text-accent shrink-0" />
                      <span>Cookiebot</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks size={16} weight="duotone" className="text-accent shrink-0" />
                      <span>OneTrust</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks size={16} weight="duotone" className="text-accent shrink-0" />
                      <span>CookieYes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks size={16} weight="duotone" className="text-accent shrink-0" />
                      <span>Quantcast Choice</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks size={16} weight="duotone" className="text-accent shrink-0" />
                      <span>Usercentrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ListChecks size={16} weight="duotone" className="text-accent shrink-0" />
                      <span>+ many more</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-3">
                    Check the <strong>Patterns</strong> tab to see the complete list. Use the <strong>Learn</strong> tab to add custom patterns for new banners.
                  </p>
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

      <BananaCelebration
        isVisible={bananaVisible}
        onDismiss={() => setBananaVisible(false)}
        bannerName={lastBannerClosed?.bannerName}
      />
    </div>
    </ThemeProvider>
  );
}

export default App;