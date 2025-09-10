
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
    <div className={cn("relative inline-grid h-20 sm:h-28 md:h-32 lg:h-36 overflow-hidden align-bottom", className)}>
        {words.map((word, i) => (
            <span
                key={word}
                className={cn(
                    "col-start-1 row-start-1 transition-all duration-300",
                    i === index
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2",
                    "[&>span]:whitespace-nowrap"
                )}
            >
               {word}
            </span>
        ))}
    </div>
  );
}
