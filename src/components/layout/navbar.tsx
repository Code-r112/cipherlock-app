import { ShieldCheck } from 'lucide-react';
import React from 'react';
import { ThemeToggle } from './theme-toggle';

export function Navbar() {
  return (
    <header className="bg-background border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-primary">CipherLock</span>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  );
}
