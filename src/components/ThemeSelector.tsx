import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Sparkle } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const THEME_OPTIONS = [
  {
    value: 'light' as const,
    label: 'Light',
    icon: Sun,
    description: 'Clean and bright interface',
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
    description: 'Tropical vibes only',
    preview: 'bg-gradient-to-br from-yellow-100 to-yellow-300',
  },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Theme</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred visual style
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  toast.success(`Switched to ${option.label} theme`);
                }}
              >
                <div className="flex flex-col gap-3">
                  <div
                    className={`h-20 rounded-lg ${option.preview} flex items-center justify-center`}
                  >
                    <Icon
                      size={32}
                      weight="duotone"
                      className={
                        option.value === 'banana'
                          ? 'text-yellow-600'
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

      {theme === 'banana' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200"
        >
          <div className="flex items-center gap-2">
            <Sparkle size={20} weight="duotone" className="text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">
              Banana mode activated! 🍌 Everything is more a-peeling now.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
