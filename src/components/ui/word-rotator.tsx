
"use client";

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
    }, 2000); 

    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <div className="relative inline-block h-20 sm:h-28 md:h-32 lg:h-36 overflow-hidden align-bottom">
        {words.map((word, i) => (
            <span
            key={word}
            className={cn(
                "absolute transition-all duration-500 ease-in-out",
                i === index ? "opacity-100 transform-none" : "opacity-0 -translate-y-full",
                className
            )}
            style={{ top: i === index ? '0' : '100%', transitionDelay: i === index ? '0.2s' : '0s' }}
            >
            {word}
            </span>
        ))}
    </div>
  );
}
