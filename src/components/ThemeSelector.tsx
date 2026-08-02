import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Sparkle, MoonStars } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const THEME_OPTIONS = [
  {
    value: 'light' as const,
    label: 'Light',
    icon: Sun,
    description: 'Clean and bright',
    preview: 'bg-gradient-to-br from-background to-accent/20',
  },
  {
    value: 'dark' as const,
    label: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes',
    preview: 'bg-gradient-to-br from-slate-900 to-slate-700',
  },
  {
    value: 'banana' as const,
    label: 'Banana',
    icon: Sparkle,
    description: '🍌 Banana Town awaits',
    preview: 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-100',
    bananaTheme: true,
  },
  {
    value: 'dark-banana' as const,
    label: 'Dark Banana',
    icon: MoonStars,
    description: '🍌 Nighttime in the tropics',
    preview: 'bg-gradient-to-br from-amber-950 via-yellow-950 to-yellow-900',
    bananaTheme: true,
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const isBananaTheme = theme === 'banana' || theme === 'dark-banana';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred visual style
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.value;

          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all ${
                  isActive
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setTheme(option.value);
                  const bananaMessage = option.bananaTheme 
                    ? ' Going bananas! 🍌'
                    : '';
                  toast.success(`Switched to ${option.label} theme${bananaMessage}`);
                }}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className={`h-20 rounded-lg ${option.preview} flex items-center justify-center relative overflow-hidden`}
                  >
                    {option.bananaTheme && (
                      <motion.div
                        className="absolute text-4xl opacity-20"
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        🍌
                      </motion.div>
                    )}
                    <Icon
                      size={32}
                      weight="duotone"
                      className={
                        option.value === 'banana'
                          ? 'text-yellow-600 relative z-10'
                          : option.value === 'dark-banana'
                          ? 'text-yellow-400 relative z-10'
                          : option.value === 'dark'
                          ? 'text-white'
                          : 'text-primary'
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold cursor-pointer">
                        {option.label}
                      </Label>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-primary"
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {isBananaTheme && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            theme === 'banana' 
              ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
              : 'bg-gradient-to-r from-amber-950/50 to-yellow-950/50 border-yellow-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="text-2xl"
            >
              🍌
            </motion.div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                theme === 'banana' ? 'text-yellow-800' : 'text-yellow-200'
              }`}>
                {theme === 'banana' 
                  ? "Banana mode activated! Everything is more a-peeling now."
                  : "Dark banana mode! Bananas after midnight. 🌙"}
              </p>
              <p className={`text-xs mt-0.5 ${
                theme === 'banana' ? 'text-yellow-600' : 'text-yellow-400/80'
              }`}>
                {theme === 'banana'
                  ? "Tropical energy for your privacy journey"
                  : "Moonlit tropics with maximum privacy protection"}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
