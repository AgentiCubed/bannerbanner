import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Cookie } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

interface BannerDemoProps {
  onApplySettings: () => void;
  isVisible: boolean;
}

export function BannerDemo({ onApplySettings, isVisible }: BannerDemoProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onApplySettings();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onApplySettings]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border shadow-2xl z-50"
    >
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie size={24} weight="duotone" className="text-accent mt-1 shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-2">We value your privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This website uses cookies to ensure you get the best experience on our website. 
                We use necessary cookies to make our site work. We'd also like to set analytics 
                cookies that help us make improvements by measuring how you use the site.
              </p>
              <p className="text-xs text-accent mt-2 font-medium">
                ⚡ BannerBanner will automatically close this in 2 seconds...
              </p>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button
            onClick={onApplySettings}
            className="flex-1 sm:flex-initial"
          >
            Apply My Settings
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-initial">
            Accept All
          </Button>
          <Button variant="ghost" className="flex-1 sm:flex-initial">
            Manage Preferences
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
