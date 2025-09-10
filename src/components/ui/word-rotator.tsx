
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  words: string[];
  className?: string;
}

export function WordRotator({ words, className }: TypewriterProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    const typeSpeed = isDeleting ? 75 : 150;

    const handleTyping = () => {
      if (isDeleting) {
        if (text.length > 0) {
          setText((prev) => prev.substring(0, prev.length - 1));
        } else {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        if (text.length < currentWord.length) {
          setText((prev) => currentWord.substring(0, prev.length + 1));
        } else {
          // Pause at end of word
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const typingTimeout = setTimeout(handleTyping, typeSpeed);

    return () => clearTimeout(typingTimeout);
  }, [text, isDeleting, wordIndex, words]);

  return (
    <span className={cn(
        "relative",
        className
    )}>
      <span className="min-h-[1em]">{text}</span>
      <span className="animate-pulse ml-1 w-[2px] h-full bg-foreground inline-block"></span>
    </span>
  );
}
