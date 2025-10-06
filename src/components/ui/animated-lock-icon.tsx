
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock } from 'lucide-react';

export function AnimatedLockIcon() {
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLocked((prev) => !prev);
    }, 2000); // Toggles every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-8 h-8">
      <AnimatePresence initial={false} mode="wait">
        {isLocked ? (
          <motion.div
            key="lock"
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-primary"
          >
            <Lock className="w-8 h-8" />
          </motion.div>
        ) : (
          <motion.div
            key="unlock"
            initial={{ opacity: 0, scale: 0.5, rotate: 45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: -45 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-primary"
          >
            <Unlock className="w-8 h-8" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
