import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Crosshair, CheckCircle, ArrowRight, Users } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

type TrainingStep = 'identify' | 'locate-accept' | 'locate-reject' | 'locate-settings' | 'test' | 'complete';

interface BannerTrainerProps {
  onComplete?: () => void;
  sharePublicly: boolean;
  onSharePubliclyChange: (value: boolean) => void;
}

export function BannerTrainer({ onComplete, sharePublicly, onSharePubliclyChange }: BannerTrainerProps) {
  const [step, setStep] = useState<TrainingStep>('identify');
  const [isTraining, setIsTraining] = useState(false);

  const steps = [
    { id: 'identify', label: 'Identify Banner', icon: Target },
    { id: 'locate-accept', label: 'Find Accept Button', icon: Crosshair },
    { id: 'locate-reject', label: 'Find Reject Button', icon: Crosshair },
    { id: 'locate-settings', label: 'Find Settings', icon: Crosshair },
    { id: 'test', label: 'Test Pattern', icon: CheckCircle },
  ];

  const handleStartTraining = () => {
    setIsTraining(true);
    setStep('identify');
  };

  const handleNextStep = () => {
    const currentIndex = steps.findIndex(s => s.id === step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1].id as TrainingStep);
    } else {
      setStep('complete');
      setTimeout(() => {
        setIsTraining(false);
        setStep('identify');
        if (onComplete) onComplete();
      }, 2000);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <GraduationCap size={24} weight="duotone" className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Train Unknown Banners</h3>
            <p className="text-sm text-muted-foreground">
              When BannerBanner encounters a new cookie banner it doesn't recognize, you can teach it how to handle that banner in the future.
            </p>
          </div>
        </div>

        <Alert>
          <Target size={18} weight="duotone" />
          <AlertDescription>
            The training mode walks you through identifying the banner's buttons and controls. Once trained, BannerBanner will automatically handle this banner type for you.
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
                Contribute your banner patterns to help other users
              </p>
            </div>
          </div>
          <Switch
            id="share-publicly"
            checked={sharePublicly}
            onCheckedChange={onSharePubliclyChange}
          />
        </div>

        {!isTraining ? (
          <div className="space-y-4">
            <div className="grid gap-3">
              <h4 className="text-sm font-semibold text-muted-foreground">Training Process:</h4>
              {steps.map((s, index) => {
                const Icon = s.icon;
                return (
                  <div key={s.id} className="flex items-center gap-3 text-sm">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground font-medium text-xs">
                      {index + 1}
                    </div>
                    <Icon size={16} weight="duotone" className="text-muted-foreground" />
                    <span className="text-muted-foreground">{s.label}</span>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleStartTraining} className="w-full">
              <GraduationCap size={18} weight="duotone" className="mr-2" />
              Start Training Mode
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const currentIndex = steps.findIndex(st => st.id === step);
                const isComplete = index < currentIndex;
                const isActive = index === currentIndex;

                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-accent/10 border-accent'
                        : isComplete
                        ? 'bg-muted/30 border-border'
                        : 'bg-background border-border/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 shrink-0">
                      {isComplete ? (
                        <CheckCircle size={20} weight="fill" className="text-accent" />
                      ) : (
                        <Icon
                          size={18}
                          weight="duotone"
                          className={isActive ? 'text-accent' : 'text-muted-foreground'}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.label}
                      </p>
                      {isActive && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Click on the {s.label.toLowerCase()} element
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-2 h-2 bg-accent rounded-full"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {step === 'complete' ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-lg bg-accent/10 border border-accent text-center"
              >
                <CheckCircle size={48} weight="duotone" className="text-accent mx-auto mb-2" />
                <p className="font-semibold text-accent mb-1">Training Complete!</p>
                <p className="text-xs text-muted-foreground">
                  {sharePublicly
                    ? 'Pattern saved and shared with the community'
                    : 'Pattern saved locally'}
                </p>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleNextStep} className="flex-1">
                  <span>Next Step</span>
                  <ArrowRight size={18} weight="bold" className="ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTraining(false);
                    setStep('identify');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        {sharePublicly && (
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-xs text-muted-foreground flex items-start gap-2">
              <Users size={14} weight="duotone" className="text-accent mt-0.5 shrink-0" />
              <span>
                When you enable community sharing, your trained banner patterns will be added to a public database that helps everyone. Your contributions make the web more private for all users!
              </span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
