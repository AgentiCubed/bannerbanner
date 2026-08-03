import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Ghost, CheckCircle } from '@phosphor-icons/react';
import type { PreferenceLevel, CookieCategories } from '@/lib/types';

interface GhostBannerPreviewProps {
  isRunning: boolean;
  preferenceLevel: PreferenceLevel;
  customCategories?: CookieCategories;
  useCustom: boolean;
}

type BannerStep = 'detecting' | 'analyzing' | 'applying' | 'closing' | 'complete';

export function GhostBannerPreview({ isRunning, preferenceLevel, customCategories, useCustom }: GhostBannerPreviewProps) {
  const [step, setStep] = useState<BannerStep>('detecting');
  const [bananaPosition, setBananaPosition] = useState({ x: -100, y: 0 });
  const [showBanana, setShowBanana] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the timer-driven animation sequence when the run stops
      setStep('detecting');
      setShowBanana(false);
      return;
    }

    setShowBanana(true);
    const sequence = async () => {
      await delay(500);
      setStep('detecting');
      setBananaPosition({ x: 20, y: 0 });
      
      await delay(1200);
      setStep('analyzing');
      setBananaPosition({ x: 50, y: -10 });
      
      await delay(1200);
      setStep('applying');
      setBananaPosition({ x: 80, y: 0 });
      
      await delay(1000);
      setStep('closing');
      setBananaPosition({ x: 95, y: -5 });
      
      await delay(800);
      setStep('complete');
      setBananaPosition({ x: 110, y: 0 });
      
      await delay(1500);
      setShowBanana(false);
    };

    sequence();
  }, [isRunning]);

  const getPreferenceText = () => {
    if (useCustom && customCategories) {
      const enabled = Object.entries(customCategories)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(', ');
      return `Custom: ${enabled}`;
    }
    
    switch (preferenceLevel) {
      case 'necessary':
        return 'Necessary only';
      case 'functional':
        return 'Functional + Necessary';
      case 'analytics':
        return 'Analytics + Functional + Necessary';
      case 'all':
        return 'All cookies';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="relative w-full h-64 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border-2 border-dashed border-border overflow-hidden">
      <AnimatePresence>
        {isRunning && (
          <>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 0.3 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-0 left-0 right-0 bg-card border-t-2 border-primary/20 p-4"
            >
              <div className="flex items-start gap-3">
                <Ghost size={32} weight="duotone" className="text-primary/40 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground/40 mb-1">
                    Cookie Consent Banner (Simulated)
                  </h4>
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    This website uses cookies to improve your experience. We need your consent to store cookies on your device...
                  </p>
                  <div className="flex gap-2 mt-2">
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded text-xs text-foreground/40">
                      Accept All
                    </div>
                    <div className="px-3 py-1 bg-secondary/10 border border-border/50 rounded text-xs text-foreground/40">
                      Reject
                    </div>
                    <div className="px-3 py-1 bg-secondary/10 border border-border/50 rounded text-xs text-foreground/40">
                      Settings
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {showBanana && (
                <motion.div
                  initial={{ x: '-10%', y: '50%', scale: 0, rotate: -45 }}
                  animate={{
                    x: `${bananaPosition.x}%`,
                    y: `${50 + bananaPosition.y}%`,
                    scale: 1,
                    rotate: step === 'complete' ? 360 : 0,
                  }}
                  exit={{ scale: 0, rotate: 180, opacity: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 150,
                    duration: 0.8,
                  }}
                  className="absolute"
                  style={{ top: 0, left: 0 }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        rotate: step === 'applying' ? [0, -10, 10, -10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl"
                    >
                      🍌
                    </motion.div>
                    {step === 'complete' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 text-2xl"
                      >
                        💪
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>

      <div className="absolute top-4 left-4 right-4">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">BannerBanner Preview</span>
            {isRunning && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-xs font-medium text-accent"
              >
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                Active
              </motion.div>
            )}
          </div>
          
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <StepIndicator
                label="Detecting banner"
                isActive={step === 'detecting'}
                isComplete={['analyzing', 'applying', 'closing', 'complete'].includes(step)}
              />
              <StepIndicator
                label="Analyzing structure"
                isActive={step === 'analyzing'}
                isComplete={['applying', 'closing', 'complete'].includes(step)}
              />
              <StepIndicator
                label={`Applying: ${getPreferenceText()}`}
                isActive={step === 'applying'}
                isComplete={['closing', 'complete'].includes(step)}
              />
              <StepIndicator
                label="Closing banner"
                isActive={step === 'closing'}
                isComplete={step === 'complete'}
              />
              {step === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-xs font-semibold text-accent pt-1"
                >
                  <CheckCircle size={16} weight="fill" />
                  Banner handled successfully!
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {!isRunning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Cookie size={48} weight="duotone" className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Click "Start Preview" to see BannerBanner in action</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ label, isActive, isComplete }: { label: string; isActive: boolean; isComplete: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {isComplete ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <CheckCircle size={14} weight="fill" className="text-accent" />
          </motion.div>
        ) : isActive ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full"
          />
        ) : (
          <div className="w-3.5 h-3.5 border-2 border-muted-foreground/30 rounded-full" />
        )}
      </div>
      <span className={`text-xs ${isActive ? 'text-foreground font-medium' : isComplete ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
        {label}
      </span>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
