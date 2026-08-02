import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';

interface BananaCelebrationProps {
  isVisible: boolean;
  onDismiss: () => void;
  bannerName?: string;
}

export function BananaCelebration({ isVisible, onDismiss, bannerName }: BananaCelebrationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="fixed bottom-6 right-6 z-[9999]"
        >
          <div className="bg-gradient-to-br from-yellow-100 via-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-2xl shadow-2xl p-4 flex items-center gap-3 min-w-[280px] relative">
            <button
              onClick={onDismiss}
              className="absolute -top-2 -right-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full p-1 transition-colors shadow-md"
              aria-label="Dismiss"
            >
              <X size={14} weight="bold" />
            </button>
            
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: "easeInOut"
              }}
              className="text-5xl"
            >
              🍌
            </motion.div>
            
            <motion.div
              animate={{
                scale: [0, 1.2, 1],
              }}
              transition={{
                duration: 0.3,
                delay: 0.4,
              }}
              className="text-4xl"
            >
              👍
            </motion.div>
            
            <div className="flex-1">
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-semibold text-yellow-900"
              >
                Banner Banned!
              </motion.p>
              {bannerName && (
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-yellow-700"
                >
                  {bannerName} removed
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
