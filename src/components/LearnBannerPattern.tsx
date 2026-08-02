import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Trash, Lightbulb, Check } from '@phosphor-icons/react';
import { toast } from 'sonner';
import type { BannerPattern } from '@/lib/banner-patterns';

export function LearnBannerPattern() {
  const [customPatterns, setCustomPatterns] = useKV<BannerPattern[]>('custom-banner-patterns', []);
  const [isAdding, setIsAdding] = useState(false);
  const [newPattern, setNewPattern] = useState<Partial<BannerPattern>>({
    name: '',
    description: '',
    selectors: {
      container: [],
      acceptAll: [],
      rejectAll: [],
      settings: [],
    },
    priority: 5,
  });

  const handleAddPattern = () => {
    if (!newPattern.name || !newPattern.description) {
      toast.error('Please provide a name and description');
      return;
    }

    const pattern: BannerPattern = {
      id: `custom-${Date.now()}`,
      name: newPattern.name,
      description: newPattern.description,
      selectors: newPattern.selectors || {
        container: [],
        acceptAll: [],
        rejectAll: [],
        settings: [],
      },
      priority: 5,
    };

    setCustomPatterns((current) => [...(current || []), pattern]);
    
    setNewPattern({
      name: '',
      description: '',
      selectors: {
        container: [],
        acceptAll: [],
        rejectAll: [],
        settings: [],
      },
      priority: 5,
    });
    
    setIsAdding(false);
    toast.success('Custom banner pattern added', {
      description: 'BannerBanner will now recognize this pattern',
    });
  };

  const handleDeletePattern = (id: string) => {
    setCustomPatterns((current) => (current || []).filter((p) => p.id !== id));
    toast.success('Custom pattern deleted');
  };

  const handleSelectorChange = (type: keyof BannerPattern['selectors'], value: string) => {
    const selectors = value.split('\n').filter(s => s.trim());
    setNewPattern((prev) => ({
      ...prev,
      selectors: {
        ...prev.selectors,
        [type]: selectors,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Learn New Banner Patterns</h3>
        <p className="text-sm text-muted-foreground mb-4">
          When BannerBanner encounters a banner it doesn't recognize, you can teach it how to handle that banner by adding custom patterns.
        </p>
      </div>

      <Alert>
        <Lightbulb size={18} weight="duotone" />
        <AlertDescription>
          To find selectors, right-click on banner elements in your browser and select "Inspect". 
          Copy CSS selectors like <code className="text-xs bg-muted px-1 py-0.5 rounded">#banner-id</code> or{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">.banner-class</code>.
        </AlertDescription>
      </Alert>

      {(customPatterns || []).length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Your Custom Patterns ({(customPatterns || []).length})</h4>
          {(customPatterns || []).map((pattern) => (
            <Card key={pattern.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Check size={16} weight="duotone" className="text-accent" />
                    <h5 className="font-semibold">{pattern.name}</h5>
                  </div>
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeletePattern(pattern.id)}
                  className="shrink-0"
                >
                  <Trash size={16} weight="duotone" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus size={18} weight="bold" />
          Add Custom Pattern
        </Button>
      ) : (
        <Card className="p-6 space-y-4 border-accent/30">
          <div className="space-y-2">
            <Label htmlFor="pattern-name">Pattern Name</Label>
            <Input
              id="pattern-name"
              placeholder="e.g., Custom Site Banner"
              value={newPattern.name}
              onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattern-description">Description</Label>
            <Input
              id="pattern-description"
              placeholder="e.g., Cookie banner on example.com"
              value={newPattern.description}
              onChange={(e) => setNewPattern({ ...newPattern, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="container-selectors">Container Selectors (one per line)</Label>
            <Textarea
              id="container-selectors"
              placeholder="#cookie-banner&#10;.consent-modal"
              rows={3}
              onChange={(e) => handleSelectorChange('container', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              CSS selectors to identify the banner container
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accept-selectors">Accept All Button Selectors (one per line)</Label>
            <Textarea
              id="accept-selectors"
              placeholder="#accept-all&#10;.btn-accept"
              rows={2}
              onChange={(e) => handleSelectorChange('acceptAll', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reject-selectors">Reject All Button Selectors (one per line)</Label>
            <Textarea
              id="reject-selectors"
              placeholder="#reject-all&#10;.btn-reject"
              rows={2}
              onChange={(e) => handleSelectorChange('rejectAll', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-selectors">Settings Button Selectors (one per line)</Label>
            <Textarea
              id="settings-selectors"
              placeholder="#settings&#10;.btn-settings"
              rows={2}
              onChange={(e) => handleSelectorChange('settings', e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleAddPattern} className="flex-1">
              <Check size={18} weight="bold" />
              Save Pattern
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
