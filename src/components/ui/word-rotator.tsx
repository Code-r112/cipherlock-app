
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WordRotatorProps {
  words: string[];
  className?: string;
}

export function WordRotator({ words, className }: WordRotatorProps) {
  const [index, setIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsExiting(false);
      }, 500); // Wait for exit animation to finish
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className={cn("relative inline-block h-20 sm:h-28 md:h-32 lg:h-36 overflow-hidden align-bottom", className)}>
      <span
        key={index}
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out",
          isExiting ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
        )}
      >
        {words[index]}
      </span>
    </div>
  );
}
