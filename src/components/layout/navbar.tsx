
"use client";

import { ShieldCheck, User as UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { UserNavSheet } from './user-nav-sheet';

export function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn("bg-background sticky top-0 z-50 transition-all", isScrolled && "border-b border-border/40")}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <div className="ml-2 flex flex-col">
                <span className="text-2xl font-bold leading-none">CipherLock</span>
                <span className="text-xs text-muted-foreground">by InstantDone</span>
            </div>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-14 w-14">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                      </Avatar>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[350px] sm:w-[400px] p-0">
                  <UserNavSheet user={user} />
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button asChild size="lg" className="h-14 text-lg rounded-full">
                  <Link href="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
