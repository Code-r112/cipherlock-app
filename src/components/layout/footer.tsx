
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 dark:bg-white dark:text-gray-800">
      <div className="border-t-4 border-primary w-full"></div>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-8 w-8 text-white dark:text-black" />
              <span className="ml-2 text-3xl font-bold text-white dark:text-black">CipherLock</span>
            </div>
            <p className="text-sm">Secure, client-side file encryption.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white dark:text-black mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="/#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white dark:text-black mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-200 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CipherLock. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
