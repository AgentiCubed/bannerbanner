import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Target, 
  Crosshair, 
  CheckCircle, 
  ArrowRight, 
  Users,
  Hand,
  Lightbulb,
  Sparkle,
  Eye,
  ArrowLeft
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

type TrainingStep = 'intro' | 'identify' | 'locate-accept' | 'locate-reject' | 'locate-settings' | 'test' | 'complete';

interface BannerTrainerEnhancedProps {
  onComplete?: () => void;
  sharePublicly: boolean;
  onSharePubliclyChange: (value: boolean) => void;
}

const STEP_GUIDANCE = {
  intro: {
    title: "Let's Train a New Banner Together! 🎓",
    description: "Don't worry, I'll guide you through every step. It only takes about 30 seconds.",
    tips: [
      "You don't need any technical knowledge",
      "Just follow the visual cues on screen",
      "You can cancel at any time",
    ],
    icon: GraduationCap,
  },
  identify: {
    title: "Step 1: Find the Cookie Banner",
    description: "Look for a popup or overlay asking about cookies. It's usually at the bottom or top of the page.",
    tips: [
      "It might say things like 'We use cookies'",
      "Common locations: bottom bar, top banner, or centered popup",
      "Click anywhere on the banner container (not the buttons)",
    ],
    icon: Target,
    example: "Look for messages like: 'Accept cookies', 'Cookie preferences', or 'We value your privacy'",
  },
  'locate-accept': {
    title: "Step 2: Point to the 'Accept All' Button",
    description: "Find the button that accepts all cookies. This is usually the most prominent button.",
    tips: [
      "Look for text like: 'Accept All', 'Allow All', 'I Agree'",
      "It's often styled with a bright color or filled background",
      "Click directly on this button",
    ],
    icon: Crosshair,
    example: "Common labels: 'Accept', 'Accept All Cookies', 'Allow', 'I Agree', 'OK'",
  },
  'locate-reject': {
    title: "Step 3: Point to the 'Reject All' Button",
    description: "Find the button that rejects or minimizes cookies. This might be less obvious.",
    tips: [
      "Look for: 'Reject All', 'Decline', 'Necessary Only'",
      "Often styled as an outline button or link",
      "Sometimes labeled 'Essential Only' or 'Deny'",
    ],
    icon: Crosshair,
    example: "Common labels: 'Reject', 'Reject All', 'Decline', 'Necessary Only', 'Essential Only'",
  },
  'locate-settings': {
    title: "Step 4: Find Settings (Optional)",
    description: "Look for a 'Cookie Settings' or 'Manage Preferences' button. Click it if you see one.",
    tips: [
      "Look for: 'Settings', 'Manage', 'Customize', 'Preferences'",
      "This is usually a secondary button or text link",
      "If you can't find it, you can skip this step",
    ],
    icon: Crosshair,
    example: "Common labels: 'Cookie Settings', 'Manage Preferences', 'Customize', 'Learn More'",
    optional: true,
  },
  test: {
    title: "Step 5: Let's Test It! 🧪",
    description: "Great work! Now BannerBanner will test if the pattern works correctly.",
    tips: [
      "This happens automatically",
      "We'll simulate closing the banner",
      "If it works, we'll save the pattern",
    ],
    icon: CheckCircle,
  },
  complete: {
    title: "All Done! You're Amazing! 🎉",
    description: "You just helped make the web more private for everyone. Thank you!",
    tips: [
      "This banner will now close automatically",
      "Your pattern is saved and ready to use",
      "You've contributed to the community!",
    ],
    icon: Sparkle,
  },
};

export function BannerTrainerEnhanced({ onComplete, sharePublicly, onSharePubliclyChange }: BannerTrainerEnhancedProps) {
  const [step, setStep] = useState<TrainingStep>('intro');
  const [isTraining, setIsTraining] = useState(false);

  const currentGuidance = STEP_GUIDANCE[step];
  const Icon = currentGuidance.icon;

  const handleStartTraining = () => {
    setIsTraining(true);
    setStep('identify');
  };

  const handleNextStep = () => {
    const stepOrder: TrainingStep[] = ['intro', 'identify', 'locate-accept', 'locate-reject', 'locate-settings', 'test', 'complete'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    } else {
      setTimeout(() => {
        setIsTraining(false);
        setStep('intro');
        if (onComplete) onComplete();
      }, 2000);
    }
  };

  const handleBackStep = () => {
    const stepOrder: TrainingStep[] = ['intro', 'identify', 'locate-accept', 'locate-reject', 'locate-settings', 'test', 'complete'];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex > 1) {
      setStep(stepOrder[currentIndex - 1]);
    } else {
      setIsTraining(false);
      setStep('intro');
    }
  };

  const handleSkipOptional = () => {
    handleNextStep();
  };

  const progressPercentage = () => {
    const stepOrder: TrainingStep[] = ['intro', 'identify', 'locate-accept', 'locate-reject', 'locate-settings', 'test', 'complete'];
    const currentIndex = stepOrder.indexOf(step);
    return ((currentIndex + 1) / stepOrder.length) * 100;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <GraduationCap size={24} weight="duotone" className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Train Unknown Banners</h3>
            <p className="text-sm text-muted-foreground">
              When you find a cookie banner we don't recognize, teach BannerBanner how to handle it. Super simple, we promise!
            </p>
          </div>
        </div>

        {!isTraining && (
          <>
            <Alert className="border-accent/50 bg-accent/5">
              <Lightbulb size={18} weight="duotone" className="text-accent" />
              <AlertDescription>
                <span className="font-semibold">No technical skills needed!</span> We'll walk you through each step with clear instructions and visual guides.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <Users size={24} weight="duotone" className={sharePublicly ? 'text-accent' : 'text-muted-foreground'} />
                <div>
                  <Label htmlFor="share-publicly" className="font-semibold cursor-pointer">
                    Share with Community
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Help other users by contributing your banner patterns
                  </p>
                </div>
              </div>
              <Switch
                id="share-publicly"
                checked={sharePublicly}
                onCheckedChange={onSharePubliclyChange}
              />
            </div>

            <div className="space-y-3 bg-muted/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Eye size={16} weight="duotone" />
                What You'll Do:
              </h4>
              <div className="grid gap-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs shrink-0">
                    1
                  </div>
                  <span className="text-muted-foreground">Click on the cookie banner</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs shrink-0">
                    2
                  </div>
                  <span className="text-muted-foreground">Point to the "Accept All" button</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs shrink-0">
                    3
                  </div>
                  <span className="text-muted-foreground">Point to the "Reject All" button</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs shrink-0">
                    4
                  </div>
                  <span className="text-muted-foreground">Find settings button (if available)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-bold text-xs shrink-0">
                    5
                  </div>
                  <span className="text-muted-foreground">Done! We'll test and save it</span>
                </div>
              </div>
            </div>

            <Button onClick={handleStartTraining} className="w-full" size="lg">
              <Hand size={20} weight="duotone" className="mr-2" />
              Start Training - I'll Guide You!
            </Button>
          </>
        )}

        <AnimatePresence mode="wait">
          {isTraining && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="space-y-4 p-6 rounded-lg bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-accent/20">
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-xl bg-accent/20 shrink-0"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Icon size={32} weight="duotone" className="text-accent" />
                  </motion.div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-bold">{currentGuidance.title}</h4>
                    <p className="text-sm text-muted-foreground">{currentGuidance.description}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={16} weight="fill" className="text-accent" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-accent">Tips:</span>
                  </div>
                  {currentGuidance.tips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle size={16} weight="fill" className="text-accent mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </motion.div>
                  ))}
                </div>

                {'example' in currentGuidance && currentGuidance.example && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-3 rounded-lg bg-background/50 border border-border/50"
                  >
                    <div className="flex items-start gap-2">
                      <Eye size={16} weight="duotone" className="text-muted-foreground mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <span className="font-semibold block mb-1">Example:</span>
                        <span className="text-muted-foreground">{currentGuidance.example}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {step === 'complete' ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent text-center space-y-3"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: 2,
                    }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.div>
                  <div>
                    <p className="font-bold text-lg text-accent mb-1">Training Complete!</p>
                    <p className="text-sm text-muted-foreground">
                      {sharePublicly
                        ? '🌍 Pattern saved and shared with the community!'
                        : '💾 Pattern saved locally to your device'}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex gap-2">
                  {step !== 'identify' && step !== 'test' && (
                    <Button variant="outline" onClick={handleBackStep} size="lg">
                      <ArrowLeft size={18} weight="bold" />
                    </Button>
                  )}
                  
                  <Button onClick={handleNextStep} className="flex-1" size="lg">
                    <span>{step === 'test' ? 'Testing...' : 'I Did It!'}</span>
                    <ArrowRight size={18} weight="bold" className="ml-2" />
                  </Button>

                  {'optional' in currentGuidance && currentGuidance.optional && (
                    <Button variant="outline" onClick={handleSkipOptional} size="lg">
                      Skip
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsTraining(false);
                      setStep('intro');
                    }}
                    size="lg"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {sharePublicly && !isTraining && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/30"
          >
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Users size={14} weight="duotone" className="text-accent mt-0.5 shrink-0" />
              <span>
                <span className="font-semibold text-foreground">Community Contribution Enabled:</span> When you train a banner, your pattern will help protect everyone's privacy across the web. Together, we're making the internet a better place! 🌍
              </span>
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
