import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  GlobeHemisphereWest, 
  CheckCircle, 
  XCircle, 
  Info, 
  ArrowSquareOut,
  FlaskIcon,
  List,
  Warning
} from '@phosphor-icons/react';
import { toast } from 'sonner';

interface TestSite {
  name: string;
  url: string;
  bannerType: string;
  description: string;
  status: 'untested' | 'working' | 'failed';
  notes?: string;
}

const TEST_SITES: TestSite[] = [
  {
    name: 'BBC',
    url: 'https://www.bbc.com',
    bannerType: 'OneTrust',
    description: 'Major news site with OneTrust cookie consent',
    status: 'untested',
  },
  {
    name: 'CNN',
    url: 'https://www.cnn.com',
    bannerType: 'OneTrust',
    description: 'News network using OneTrust framework',
    status: 'untested',
  },
  {
    name: 'Forbes',
    url: 'https://www.forbes.com',
    bannerType: 'TrustArc',
    description: 'Business magazine with TrustArc implementation',
    status: 'untested',
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com',
    bannerType: 'Custom',
    description: 'UK newspaper with custom consent manager',
    status: 'untested',
  },
  {
    name: 'Medium',
    url: 'https://medium.com',
    bannerType: 'Custom',
    description: 'Publishing platform with privacy controls',
    status: 'untested',
  },
  {
    name: 'Etsy',
    url: 'https://www.etsy.com',
    bannerType: 'Cookiebot',
    description: 'E-commerce site using Cookiebot',
    status: 'untested',
  },
];

export function RealWorldTester() {
  const [testResults, setTestResults] = useState<TestSite[]>(TEST_SITES);
  const [selectedSite, setSelectedSite] = useState<TestSite | null>(null);

  const handleTestResult = (site: TestSite, success: boolean, notes?: string) => {
    setTestResults((current) =>
      current.map((s) =>
        s.url === site.url
          ? { ...s, status: success ? 'working' : 'failed', notes }
          : s
      )
    );
    toast.success(`Test result recorded for ${site.name}`);
  };

  const resetTests = () => {
    setTestResults(TEST_SITES);
    toast.info('Test results cleared');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <GlobeHemisphereWest size={24} weight="duotone" className="text-primary" />
          Real-World Testing
        </h3>
        <p className="text-sm text-muted-foreground">
          Test BannerBanner on actual websites with live cookie banners to verify it works in the wild.
        </p>
      </div>

      <Alert>
        <Info size={18} weight="duotone" />
        <AlertDescription>
          <strong>Important:</strong> Real-world testing requires the browser extension to be installed and active. 
          The testing process involves opening real websites and observing whether BannerBanner successfully detects 
          and handles their cookie banners.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="guide" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <List size={18} weight="duotone" />
            Testing Guide
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-2">
            <FlaskIcon size={18} weight="duotone" />
            Test Sites
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <CheckCircle size={18} weight="duotone" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guide" className="space-y-4 mt-4">
          <Card className="p-6">
            <h4 className="font-semibold mb-4">📋 How to Test on Real Websites</h4>
            
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h5 className="font-semibold mb-2">Step 1: Install the Extension</h5>
                <p className="text-sm text-muted-foreground">
                  Load the unpacked extension from the <code className="bg-muted px-2 py-0.5 rounded text-xs">/extension</code> directory 
                  in Chrome by going to <code className="bg-muted px-2 py-0.5 rounded text-xs">chrome://extensions/</code>, 
                  enabling "Developer mode", and clicking "Load unpacked".
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h5 className="font-semibold mb-2">Step 2: Configure Your Preferences</h5>
                <p className="text-sm text-muted-foreground">
                  Set your privacy preferences in the extension popup (click the BannerBanner icon in your toolbar). 
                  Choose "Necessary Only" for maximum privacy protection.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h5 className="font-semibold mb-2">Step 3: Visit Test Sites</h5>
                <p className="text-sm text-muted-foreground">
                  Open one of the test websites in a new tab. Use incognito/private mode to ensure the cookie banner appears fresh.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h5 className="font-semibold mb-2">Step 4: Observe the Behavior</h5>
                <p className="text-sm text-muted-foreground mb-2">
                  Watch for these signs of success:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>✓ Cookie banner appears briefly (1-2 seconds max)</li>
                  <li>✓ Banner automatically closes without interaction</li>
                  <li>✓ Banana celebration appears (if enabled)</li>
                  <li>✓ No cookie banner reappears on page refresh</li>
                </ul>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h5 className="font-semibold mb-2">Step 5: Verify Cookie Settings</h5>
                <p className="text-sm text-muted-foreground">
                  Open your browser's DevTools (F12) → Application → Cookies to verify that only necessary cookies 
                  were accepted. Analytics and marketing cookies should be absent or set to rejected.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4 bg-accent/5 p-3 rounded">
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <Warning size={18} weight="duotone" className="text-accent" />
                  Troubleshooting Tips
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Clear cookies and cache before testing</li>
                  <li>• Use incognito mode for clean tests</li>
                  <li>• Check browser console for errors (F12)</li>
                  <li>• Ensure extension permissions are granted</li>
                  <li>• Try disabling other cookie extensions</li>
                  <li>• Some sites may have CSRF protections that interfere</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sites" className="space-y-3 mt-4">
          {testResults.map((site) => (
            <Card key={site.url} className="p-4 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{site.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {site.bannerType}
                    </Badge>
                    {site.status === 'working' && (
                      <CheckCircle size={18} weight="fill" className="text-green-600" />
                    )}
                    {site.status === 'failed' && (
                      <XCircle size={18} weight="fill" className="text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{site.description}</p>
                  {site.notes && (
                    <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                      Note: {site.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.open(site.url, '_blank');
                      setSelectedSite(site);
                    }}
                  >
                    <ArrowSquareOut size={16} weight="duotone" className="mr-2" />
                    Open Site
                  </Button>
                  {selectedSite?.url === site.url && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleTestResult(site, true)}
                        className="flex-1"
                      >
                        ✓
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleTestResult(site, false)}
                        className="flex-1"
                      >
                        ✗
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-2">Add Your Own Test Site</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Found a site with a cookie banner you want to test? Open it in a new tab and observe the behavior, 
              then report your findings in the extension's feedback form.
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon: Custom Site Testing
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold">Test Results Summary</h4>
              <Button variant="outline" size="sm" onClick={resetTests}>
                Clear Results
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold">
                  {testResults.filter((s) => s.status === 'working').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <CheckCircle size={14} weight="fill" className="text-green-600" />
                  Working
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold">
                  {testResults.filter((s) => s.status === 'failed').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <XCircle size={14} weight="fill" className="text-red-600" />
                  Failed
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold">
                  {testResults.filter((s) => s.status === 'untested').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Not Tested
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">Test Details</h5>
              {testResults
                .filter((s) => s.status !== 'untested')
                .map((site) => (
                  <div
                    key={site.url}
                    className="flex items-center justify-between p-3 rounded border"
                  >
                    <div className="flex items-center gap-3">
                      {site.status === 'working' ? (
                        <CheckCircle size={20} weight="fill" className="text-green-600" />
                      ) : (
                        <XCircle size={20} weight="fill" className="text-red-600" />
                      )}
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-xs text-muted-foreground">{site.bannerType}</div>
                      </div>
                    </div>
                    {site.notes && (
                      <div className="text-xs text-muted-foreground max-w-xs">
                        {site.notes}
                      </div>
                    )}
                  </div>
                ))}
              {testResults.every((s) => s.status === 'untested') && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tests completed yet.</p>
                  <p className="text-sm mt-2">Start testing by visiting the sites in the "Test Sites" tab.</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6 bg-primary/5 border-primary/20">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Info size={20} weight="duotone" className="text-primary" />
          Extension Testing Best Practices
        </h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Always use incognito mode</strong> when testing to ensure cookies are cleared between tests
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Check the extension icon</strong> - it should show a badge count when banners are detected
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Monitor browser console</strong> for debugging information and error messages
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Test multiple times</strong> - some banners have delayed loading or dynamic behavior
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>
              <strong>Document failures</strong> - if a banner isn't detected, note the site and banner type for pattern development
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
