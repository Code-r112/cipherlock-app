
"use client";

import { ShieldCheck, User as UserIcon, LogOut, History } from 'lucide-react';
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

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-black dark:text-white" />
            <span className="ml-2 text-xl font-bold text-black dark:text-white">CipherLock</span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button asChild variant="outline">
                  <Link href="/activity"><History className="mr-2" />Activity</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 w-12 rounded-full">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                      <AvatarFallback>
                          <UserIcon />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-lg font-medium leading-none">{user.displayName}</p>
                      <p className="text-base leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-base">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild size="lg">
                <Link href="/auth">Sign In</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
