
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WordRotatorProps {
  words: string[];
  className?: string;
}

export function WordRotator({ words, className }: WordRotatorProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [words]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -20,
        }}
        transition={{ ease: "easeInOut", duration: 0.5 }}
        className={cn(
          "bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400",
          className
        )}
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}
