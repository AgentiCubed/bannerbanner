import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MagnifyingGlass, 
  CheckCircle, 
  Gear,
  Cookie,
  Sparkle 
} from '@phosphor-icons/react';
import { BANNER_PATTERNS, type BannerPattern } from '@/lib/banner-patterns';

export function BannerPatternsList() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatterns = BANNER_PATTERNS.filter(pattern => 
    pattern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pattern.framework?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPatternIcon = (pattern: BannerPattern) => {
    if (pattern.priority === 1) {
      return <CheckCircle size={20} weight="duotone" className="text-accent" />;
    }
    return <Cookie size={20} weight="duotone" className="text-muted-foreground" />;
  };

  const getFeatureCount = (pattern: BannerPattern) => {
    let count = 0;
    if (pattern.selectors.acceptAll?.length) count++;
    if (pattern.selectors.rejectAll?.length) count++;
    if (pattern.selectors.settings?.length) count++;
    if (pattern.selectors.saveSettings?.length) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Supported Banner Patterns</h3>
        <p className="text-sm text-muted-foreground mb-4">
          BannerBanner recognizes {BANNER_PATTERNS.length} different cookie consent frameworks and patterns
        </p>
        
        <div className="relative">
          <MagnifyingGlass 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-3">
          {filteredPatterns.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground">No patterns found matching "{searchQuery}"</p>
            </Card>
          ) : (
            filteredPatterns.map((pattern) => (
              <Card 
                key={pattern.id} 
                className="p-4 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10 shrink-0">
                    {getPatternIcon(pattern)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{pattern.name}</h4>
                        {pattern.framework && (
                          <Badge variant="secondary" className="text-xs">
                            {pattern.framework}
                          </Badge>
                        )}
                        {pattern.priority === 1 && (
                          <Badge variant="outline" className="text-xs border-accent text-accent">
                            <Sparkle size={12} className="mr-1" weight="fill" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {pattern.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Gear size={14} weight="duotone" />
                        <span>{getFeatureCount(pattern)} actions</span>
                      </div>
                      {pattern.selectors.container && (
                        <div className="flex items-center gap-1">
                          <CheckCircle size={14} weight="duotone" />
                          <span>{pattern.selectors.container.length} selectors</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 rounded-lg bg-muted/30 border border-border">
        <div className="flex items-start gap-2">
          <CheckCircle size={18} weight="duotone" className="text-accent mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Premium patterns</strong> have dedicated support for popular frameworks. 
            Generic patterns provide fallback coverage for custom implementations.
          </p>
        </div>
      </div>
    </div>
  );
}
