import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  GlobeHemisphereWest, 
  CheckCircle, 
  XCircle, 
  Info, 
  ArrowSquareOut,
  FlaskIcon,
  List,
  Warning,
  Clock,
  Target,
  ChartBar
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { TestSite, TestResult, TestStatus } from '@/lib/types';

const INITIAL_TEST_SITES: Omit<TestSite, 'testResult'>[] = [
  {
    name: 'BBC',
    url: 'https://www.bbc.com',
    bannerType: 'OneTrust',
    description: 'Major news site with OneTrust cookie consent',
  },
  {
    name: 'CNN',
    url: 'https://www.cnn.com',
    bannerType: 'OneTrust',
    description: 'News network using OneTrust framework',
  },
  {
    name: 'Forbes',
    url: 'https://www.forbes.com',
    bannerType: 'TrustArc',
    description: 'Business magazine with TrustArc implementation',
  },
  {
    name: 'The Guardian',
    url: 'https://www.theguardian.com',
    bannerType: 'Custom',
    description: 'UK newspaper with custom consent manager',
  },
  {
    name: 'Medium',
    url: 'https://medium.com',
    bannerType: 'Custom',
    description: 'Publishing platform with privacy controls',
  },
  {
    name: 'Etsy',
    url: 'https://www.etsy.com',
    bannerType: 'Cookiebot',
    description: 'E-commerce site using Cookiebot',
  },
];

export function RealWorldTester() {
  const [testResults, setTestResults] = useKV<Record<string, TestResult>>('test-results', {});
  const [selectedSite, setSelectedSite] = useState<TestSite | null>(null);
  const [isRecordingResult, setIsRecordingResult] = useState(false);
  const [detailedNotes, setDetailedNotes] = useState('');
  const [bannerDetected, setBannerDetected] = useState(true);
  const [bannerClosed, setBannerClosed] = useState(true);
  const [cookiesVerified, setCookiesVerified] = useState(false);

  const testSites: TestSite[] = INITIAL_TEST_SITES.map(site => ({
    ...site,
    testResult: testResults?.[site.url],
  }));

  const getStatusFromResult = (result?: TestResult): TestStatus => {
    if (!result) return 'untested';
    return result.status;
  };

  const handleStartTest = (site: TestSite) => {
    window.open(site.url, '_blank');
    setSelectedSite(site);
    setDetailedNotes('');
    setBannerDetected(true);
    setBannerClosed(true);
    setCookiesVerified(false);
  };

  const handleOpenRecordDialog = (success: boolean) => {
    setIsRecordingResult(true);
  };

  const handleRecordResult = (success: boolean) => {
    if (!selectedSite) return;

    const existingResult = testResults?.[selectedSite.url];
    const now = Date.now();

    let status: TestStatus = 'untested';
    if (success) {
      status = 'working';
    } else if (!bannerDetected) {
      status = 'untested';
    } else if (bannerDetected && !bannerClosed) {
      status = 'failed';
    } else if (bannerDetected && bannerClosed && !cookiesVerified) {
      status = 'partial';
    } else {
      status = 'failed';
    }

    const newResult: TestResult = {
      url: selectedSite.url,
      status,
      timestamp: now,
      notes: detailedNotes || undefined,
      attemptCount: (existingResult?.attemptCount || 0) + 1,
      lastAttemptTimestamp: now,
      successCount: (existingResult?.successCount || 0) + (success ? 1 : 0),
      failureCount: (existingResult?.failureCount || 0) + (success ? 0 : 1),
      bannerDetected,
      bannerClosed,
      cookiesVerified,
    };

    setTestResults((current) => ({
      ...(current || {}),
      [selectedSite.url]: newResult,
    }));

    toast.success(`Test result recorded for ${selectedSite.name}`, {
      description: `Status: ${status} (Attempt ${newResult.attemptCount})`,
    });

    setIsRecordingResult(false);
    setSelectedSite(null);
    setDetailedNotes('');
  };

  const resetTests = () => {
    setTestResults({});
    toast.info('All test results cleared');
  };

  const getSuccessRate = (): number => {
    const allResults = Object.values(testResults || {});
    if (allResults.length === 0) return 0;
    const totalAttempts = allResults.reduce((sum, r) => sum + r.attemptCount, 0);
    const totalSuccess = allResults.reduce((sum, r) => sum + r.successCount, 0);
    return totalAttempts > 0 ? Math.round((totalSuccess / totalAttempts) * 100) : 0;
  };

  const getStatusBadgeColor = (status: TestStatus): string => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <GlobeHemisphereWest size={24} weight="duotone" className="text-primary" />
          Real-World Testing
        </h3>
        <p className="text-sm text-muted-foreground">
          Test BannerBanner on actual websites with live cookie banners and track detailed results across sessions.
        </p>
      </div>

      <Alert>
        <Info size={18} weight="duotone" />
        <AlertDescription>
          <strong>Persistent Testing:</strong> All test results are saved automatically and persist between sessions. 
          Track success rates, retry counts, and detailed notes for each website you test.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ChartBar size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{getSuccessRate()}%</div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Target size={24} weight="duotone" className="text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Object.values(testResults || {}).reduce((sum, r) => sum + r.attemptCount, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-muted/50 to-muted border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Clock size={24} weight="duotone" className="text-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {Object.keys(testResults || {}).length}/{INITIAL_TEST_SITES.length}
              </div>
              <div className="text-xs text-muted-foreground">Sites Tested</div>
            </div>
          </div>
        </Card>
      </div>

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
            Results History
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

              <div className="border-l-4 border-primary pl-4">
                <h5 className="font-semibold mb-2">Step 6: Record Your Results</h5>
                <p className="text-sm text-muted-foreground">
                  Return to the Test Sites tab and click the checkmark (✓) if successful or X (✗) if failed. 
                  Add detailed notes about what happened - all data is saved automatically!
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
          {testSites.map((site) => {
            const result = site.testResult;
            const status = getStatusFromResult(result);
            
            return (
              <Card key={site.url} className="p-4 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="font-semibold">{site.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {site.bannerType}
                      </Badge>
                      {status !== 'untested' && (
                        <Badge className={`text-xs ${getStatusBadgeColor(status)}`}>
                          {status === 'working' && <CheckCircle size={12} weight="fill" className="mr-1" />}
                          {status === 'failed' && <XCircle size={12} weight="fill" className="mr-1" />}
                          {status === 'partial' && <Warning size={12} weight="fill" className="mr-1" />}
                          {status.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{site.description}</p>
                    
                    {result && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            Last tested: {formatTimestamp(result.lastAttemptTimestamp || result.timestamp)}
                          </span>
                          <span>Attempts: {result.attemptCount}</span>
                          <span className="text-green-600">✓ {result.successCount}</span>
                          <span className="text-red-600">✗ {result.failureCount}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs">
                          <span className={result.bannerDetected ? 'text-green-600' : 'text-red-600'}>
                            {result.bannerDetected ? '✓' : '✗'} Banner detected
                          </span>
                          <span className={result.bannerClosed ? 'text-green-600' : 'text-red-600'}>
                            {result.bannerClosed ? '✓' : '✗'} Banner closed
                          </span>
                          <span className={result.cookiesVerified ? 'text-green-600' : 'text-gray-400'}>
                            {result.cookiesVerified ? '✓' : '○'} Cookies verified
                          </span>
                        </div>

                        {result.notes && (
                          <p className="text-xs text-muted-foreground italic border-l-2 border-muted pl-2 mt-2">
                            {result.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartTest(site)}
                    >
                      <ArrowSquareOut size={16} weight="duotone" className="mr-2" />
                      Test Site
                    </Button>
                    {selectedSite?.url === site.url && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleOpenRecordDialog(true)}
                          className="flex-1"
                          title="Record successful test"
                        >
                          ✓
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenRecordDialog(false)}
                          className="flex-1"
                          title="Record failed test"
                        >
                          ✗
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}

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
              <h4 className="font-semibold">Test Results History</h4>
              <Button variant="outline" size="sm" onClick={resetTests}>
                Clear All Data
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold text-green-600">
                  {testSites.filter((s) => getStatusFromResult(s.testResult) === 'working').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <CheckCircle size={14} weight="fill" className="text-green-600" />
                  Working
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold text-yellow-600">
                  {testSites.filter((s) => getStatusFromResult(s.testResult) === 'partial').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Warning size={14} weight="fill" className="text-yellow-600" />
                  Partial
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold text-red-600">
                  {testSites.filter((s) => getStatusFromResult(s.testResult) === 'failed').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <XCircle size={14} weight="fill" className="text-red-600" />
                  Failed
                </div>
              </div>
              <div className="text-center p-4 rounded-lg border bg-muted/30">
                <div className="text-2xl font-bold">
                  {testSites.filter((s) => getStatusFromResult(s.testResult) === 'untested').length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Not Tested
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-semibold text-sm">Detailed Test History</h5>
              {Object.entries(testResults || {})
                .sort(([, a], [, b]) => (b.lastAttemptTimestamp || b.timestamp) - (a.lastAttemptTimestamp || a.timestamp))
                .map(([url, result]) => {
                  const site = testSites.find(s => s.url === url);
                  if (!site) return null;

                  return (
                    <div
                      key={url}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {result.status === 'working' && (
                            <CheckCircle size={20} weight="fill" className="text-green-600 shrink-0" />
                          )}
                          {result.status === 'failed' && (
                            <XCircle size={20} weight="fill" className="text-red-600 shrink-0" />
                          )}
                          {result.status === 'partial' && (
                            <Warning size={20} weight="fill" className="text-yellow-600 shrink-0" />
                          )}
                          <div>
                            <div className="font-medium">{site.name}</div>
                            <div className="text-xs text-muted-foreground">{site.bannerType}</div>
                          </div>
                        </div>
                        <Badge className={`text-xs ${getStatusBadgeColor(result.status)}`}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div>Total attempts: {result.attemptCount}</div>
                        <div>Success rate: {result.attemptCount > 0 ? Math.round((result.successCount / result.attemptCount) * 100) : 0}%</div>
                        <div>Successful: {result.successCount}</div>
                        <div>Failed: {result.failureCount}</div>
                      </div>

                      <div className="flex items-center gap-3 text-xs mb-2">
                        <span className={result.bannerDetected ? 'text-green-600' : 'text-red-600'}>
                          {result.bannerDetected ? '✓' : '✗'} Detected
                        </span>
                        <span className={result.bannerClosed ? 'text-green-600' : 'text-red-600'}>
                          {result.bannerClosed ? '✓' : '✗'} Closed
                        </span>
                        <span className={result.cookiesVerified ? 'text-green-600' : 'text-gray-400'}>
                          {result.cookiesVerified ? '✓' : '○'} Verified
                        </span>
                      </div>

                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={12} />
                        Last tested: {formatTimestamp(result.lastAttemptTimestamp || result.timestamp)}
                      </div>

                      {result.notes && (
                        <div className="mt-2 text-xs text-muted-foreground italic border-l-2 border-muted pl-2">
                          {result.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              {Object.keys(testResults || {}).length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FlaskIcon size={48} weight="duotone" className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No tests recorded yet</p>
                  <p className="text-sm mt-2">Start testing sites to build your results history!</p>
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

      <Dialog open={isRecordingResult} onOpenChange={setIsRecordingResult}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Test Result</DialogTitle>
            <DialogDescription>
              Provide details about what happened during the test for {selectedSite?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="banner-detected"
                checked={bannerDetected}
                onCheckedChange={(checked) => setBannerDetected(checked as boolean)}
              />
              <Label htmlFor="banner-detected" className="text-sm cursor-pointer">
                Cookie banner was detected on the page
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="banner-closed"
                checked={bannerClosed}
                onCheckedChange={(checked) => setBannerClosed(checked as boolean)}
              />
              <Label htmlFor="banner-closed" className="text-sm cursor-pointer">
                Banner was automatically closed
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cookies-verified"
                checked={cookiesVerified}
                onCheckedChange={(checked) => setCookiesVerified(checked as boolean)}
              />
              <Label htmlFor="cookies-verified" className="text-sm cursor-pointer">
                Verified cookies in DevTools (correct preferences applied)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="test-notes" className="text-sm">
                Additional Notes (optional)
              </Label>
              <Textarea
                id="test-notes"
                placeholder="e.g., Banner appeared after 2 seconds, needed multiple clicks, cookies were not correctly set..."
                value={detailedNotes}
                onChange={(e) => setDetailedNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordingResult(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleRecordResult(bannerDetected && bannerClosed)}
              disabled={!selectedSite}
            >
              Save Result
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
