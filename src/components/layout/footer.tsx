import { Github, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">CipherLock</span>
            </div>
            <p className="text-sm">Secure file encryption powered by AES. Your privacy is our priority.</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Developer</h3>
            <p className="text-sm">This project is open-source. Contribute or check out the code on GitHub.</p>
            <div className="flex justify-center md:justify-start mt-4">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CipherLock. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
