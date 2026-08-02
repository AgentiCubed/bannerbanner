import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { getRandomBananaCameo, shouldReduceMotion, type BananaCameo } from '@/lib/banana-town-cameos';

interface BananaTownCameoProps {
  isVisible: boolean;
  onDismiss: () => void;
  bannerName?: string;
}

export function BananaTownCameo({ isVisible, onDismiss, bannerName }: BananaTownCameoProps) {
  const [cameo, setCameo] = useState<BananaCameo | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isVisible && !shouldReduceMotion()) {
      const selectedCameo = getRandomBananaCameo();
      setCameo(selectedCameo);
      setShowCelebration(true);

      const timer = setTimeout(() => {
        setShowCelebration(false);
        onDismiss();
      }, selectedCameo.duration);

      return () => clearTimeout(timer);
    } else if (isVisible && shouldReduceMotion()) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onDismiss();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (shouldReduceMotion()) {
    return (
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 z-[9999]"
          >
            <div className="banana-town-card">
              <button
                onClick={onDismiss}
                className="banana-close-button"
                aria-label="Dismiss"
              >
                <X size={14} weight="bold" />
              </button>
              
              <div className="text-5xl">🍌</div>
              <div className="text-4xl">👍</div>
              
              <div className="flex-1">
                <p className="font-semibold text-yellow-900">
                  Banner Banned!
                </p>
                {bannerName && (
                  <p className="text-xs text-yellow-700">
                    {bannerName} removed
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (!cameo || !showCelebration) return null;

  return (
    <AnimatePresence>
      {showCelebration && (
        <>
          {cameo.animation === 'zipline' && <ZiplineWorkerBanana onDismiss={onDismiss} />}
          {cameo.animation === 'walk' && <LawyerBanana onDismiss={onDismiss} />}
          {cameo.animation === 'bike' && <KidBananaBike onDismiss={onDismiss} />}
          {cameo.animation === 'float' && <NewspaperBananaFloat onDismiss={onDismiss} bannerName={bannerName} />}
          {cameo.animation === 'dance' && <BananaBunchDance onDismiss={onDismiss} />}
          {cameo.animation === 'investigate' && <DetectiveBanana onDismiss={onDismiss} bannerName={bannerName} />}
          {cameo.animation === 'bench' && <ElderlyBananaBench onDismiss={onDismiss} />}
          {cameo.animation === 'chef' && <ChefBanana onDismiss={onDismiss} />}
        </>
      )}
    </AnimatePresence>
  );
}

function ZiplineWorkerBanana({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ x: -200, y: -20 }}
      animate={{ x: 'calc(100vw + 200px)', y: 80 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3, ease: 'linear' }}
      className="fixed top-0 z-[9999] pointer-events-none"
      style={{ left: 0 }}
    >
      <div className="relative">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-20 bg-yellow-800/30 origin-top rotate-12" />
        <motion.div
          animate={{ rotate: [0, -2, 0, -2, 0] }}
          transition={{ duration: 0.3, repeat: Infinity }}
          className="text-6xl relative"
          style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
        >
          🍌
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg">👷</div>
      </div>
      <button onClick={onDismiss} className="absolute -top-4 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function LawyerBanana({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 200 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ duration: 3.5, ease: 'easeInOut' }}
      className="fixed bottom-20 z-[9999] pointer-events-none"
      style={{ left: 0 }}
    >
      <motion.div className="relative">
        <motion.div
          animate={{
            x: [0, 3, 0, 3, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="text-6xl"
          style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
        >
          🍌
        </motion.div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-2xl">🎩</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 text-lg">👔</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.5, times: [0, 0.3, 0.6, 1] }}
          className="absolute top-1/3 right-0 text-xl"
        >
          👓
        </motion.div>
        <motion.div
          animate={{ rotate: [0, -15, 0] }}
          transition={{ duration: 1.5, delay: 2 }}
          className="absolute -top-2 left-1/2 text-2xl origin-bottom"
        >
          🎩
        </motion.div>
      </motion.div>
      <button onClick={onDismiss} className="absolute -top-4 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function KidBananaBike({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ x: -200 }}
      animate={{ x: 'calc(100vw + 200px)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 4, ease: 'easeInOut' }}
      className="fixed bottom-12 z-[9999] pointer-events-none"
      style={{ left: 0 }}
    >
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -3, 0, -2, 0, -4, 0],
            rotate: [0, -3, 2, -2, 1, -1, 0],
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="text-5xl"
          style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
        >
          🍌
        </motion.div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 text-xl">🚲</div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-sm">🧢</div>
      </div>
      <button onClick={onDismiss} className="absolute -top-4 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function NewspaperBananaFloat({ onDismiss, bannerName }: { onDismiss: () => void; bannerName?: string }) {
  return (
    <motion.div
      initial={{ x: 'calc(100vw + 200px)', y: 100 }}
      animate={{ x: -200, y: 80 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3.5, ease: 'linear' }}
      className="fixed top-0 z-[9999] pointer-events-none"
    >
      <div className="relative">
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 3, 0, -3, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl"
          style={{ filter: 'drop-shadow(4px 4px 12px rgba(0,0,0,0.4))' }}
        >
          🍌
        </motion.div>
        <div className="absolute top-1/2 left-3/4 text-4xl">🪑</div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-2xl">📰</div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-sm">👓</div>
        {bannerName && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-yellow-100 border border-yellow-400 px-2 py-1 rounded-full shadow-lg">
            "{bannerName}" banned! ✓
          </div>
        )}
      </div>
      <button onClick={onDismiss} className="absolute -top-4 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function BananaBunchDance({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ y: 'calc(100vh + 200px)' }}
      animate={{ y: 'calc(50vh - 100px)' }}
      exit={{ y: -200, opacity: 0 }}
      transition={{ duration: 3 }}
      className="fixed left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
    >
      <div className="relative flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              rotate: [0, -15, 15, -10, 10, 0],
              y: [0, -10, 0, -5, 0],
              scale: [1, 1.1, 1, 1.05, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: 3,
              delay: i * 0.1,
            }}
            className="text-4xl"
            style={{ filter: 'drop-shadow(2px 2px 6px rgba(0,0,0,0.3))' }}
          >
            🍌
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
          transition={{ delay: 1.5 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 text-3xl"
        >
          🎵
        </motion.div>
      </div>
      <button onClick={onDismiss} className="absolute -top-12 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function DetectiveBanana({ onDismiss, bannerName }: { onDismiss: () => void; bannerName?: string }) {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 120, opacity: 1 }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 3.5 }}
      className="fixed bottom-20 z-[9999] pointer-events-none"
      style={{ left: 0 }}
    >
      <div className="relative">
        <motion.div className="text-6xl" style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}>
          🍌
        </motion.div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-xl">🕵️</div>
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0, -20, 0],
            y: [0, -10, 0],
          }}
          transition={{ duration: 2.5, times: [0, 0.3, 0.5, 0.7, 1] }}
          className="absolute top-1/2 -right-4 text-3xl"
        >
          🔍
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
          transition={{ delay: 2.5, duration: 0.5 }}
          className="absolute -top-4 right-0 text-2xl"
        >
          ✓
        </motion.div>
        {bannerName && (
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-yellow-100 border border-yellow-400 px-3 py-1 rounded-full shadow-lg font-mono">
            Case closed: {bannerName}
          </div>
        )}
      </div>
      <button onClick={onDismiss} className="absolute -top-4 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function ElderlyBananaBench({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ x: 'calc(100vw + 200px)' }}
      animate={{ x: 'calc(50vw - 100px)' }}
      exit={{ x: -200, opacity: 0 }}
      transition={{ duration: 4 }}
      className="fixed bottom-16 z-[9999] pointer-events-none"
    >
      <div className="relative">
        <div className="text-5xl">🪑</div>
        <motion.div
          className="absolute top-0 -left-8 text-6xl"
          style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
        >
          🍌
        </motion.div>
        <div className="absolute top-1/4 -left-6 text-sm">👓</div>
        <div className="absolute top-1/3 -left-5 text-xs">🧓</div>
        <motion.div
          animate={{
            y: [0, -15, -5, -20, -10, 0],
            x: [0, 5, 2, 8, 4, 0],
          }}
          transition={{ duration: 3, times: [0, 0.25, 0.4, 0.6, 0.8, 1] }}
          className="absolute top-1/2 left-8 text-2xl"
        >
          🐦
        </motion.div>
        <motion.div
          animate={{
            y: [0, -12, -8, -15, -5, 0],
            x: [0, 3, 6, 2, 8, 0],
          }}
          transition={{ duration: 3, times: [0, 0.3, 0.45, 0.65, 0.85, 1] }}
          className="absolute top-1/2 left-12 text-xl"
        >
          🐦
        </motion.div>
      </div>
      <button onClick={onDismiss} className="absolute -top-4 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}

function ChefBanana({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ y: 'calc(100vh + 200px)' }}
      animate={{ y: 'calc(50vh - 80px)' }}
      exit={{ y: -200, opacity: 0 }}
      transition={{ duration: 3.2 }}
      className="fixed left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
    >
      <div className="relative">
        <motion.div
          className="text-6xl"
          style={{ filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.3))' }}
        >
          🍌
        </motion.div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl">👨‍🍳</div>
        <motion.div
          animate={{
            y: [0, -60, -80, -60, 0],
            rotate: [0, 180, 360, 540, 720],
          }}
          transition={{ duration: 2, times: [0, 0.3, 0.5, 0.7, 1] }}
          className="absolute -top-4 -right-8 text-4xl"
        >
          🥞
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.5, 1.5, 0] }}
          transition={{ duration: 0.5, delay: 2, times: [0, 0.2, 0.8, 1] }}
          className="absolute -top-4 -right-8 text-2xl"
        >
          ✨
        </motion.div>
      </div>
      <button onClick={onDismiss} className="absolute -top-16 -right-4 pointer-events-auto opacity-0 hover:opacity-100 transition-opacity">
        <X size={20} weight="bold" className="text-yellow-900" />
      </button>
    </motion.div>
  );
}
