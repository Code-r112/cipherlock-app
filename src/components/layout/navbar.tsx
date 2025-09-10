
"use client";

import { ShieldCheck, User as UserIcon, LogOut, History, KeyRound, ShieldAlert } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { ThemeToggle } from './theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-black dark:text-white" />
            <span className="ml-2 text-xl font-bold text-black dark:text-white">CipherLock</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon">
                            <Link href="/activity"><History /></Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Activity Log</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
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
              <Button asChild size="lg">
                  <Link href="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
