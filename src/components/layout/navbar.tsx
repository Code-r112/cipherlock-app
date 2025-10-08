

"use client";

import { ShieldCheck, User as UserIcon, LogOut, History, KeyRound, ShieldAlert, Settings, Moon, Sun } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';


export function Navbar() {
  const { user, signOut } = useAuth();
  const { setTheme } = useTheme();
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
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold">CipherLock</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-14 w-14 rounded-full">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>
                          <UserIcon />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-medium leading-none">{user.displayName}</p>
                      <p className="text-base leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link href="/activity">
                      <History className="mr-2 h-5 w-5" />
                      <span>Activity Log</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link href="/keys">
                      <KeyRound className="mr-2 h-5 w-5" />
                      <span>Key Management</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link href="/security-center">
                      <ShieldAlert className="mr-2 h-5 w-5" />
                      <span>Security Center</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-base cursor-pointer">
                    <Link href="/settings">
                      <Settings className="mr-2 h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-base cursor-pointer">
                      <Sun className="mr-2 h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute mr-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span>Toggle Theme</span>
                    </DropdownMenuSubTrigger>
                     <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           <DropdownMenuItem onClick={() => setTheme("light")}>
                                Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                                Dark
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                     </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-base cursor-pointer">
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
