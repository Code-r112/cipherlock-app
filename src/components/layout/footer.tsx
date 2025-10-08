
import { ShieldCheck, Code, Bot, FileText } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const otherApps = [
    { name: 'Code Formatter', icon: <Code className="h-8 w-8" />, href: '#' },
    { name: 'AI Assistant', icon: <Bot className="h-8 w-8" />, href: '#' },
    { name: 'Doc Scanner', icon: <FileText className="h-8 w-8" />, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 dark:bg-white dark:text-gray-800">
      <div className="border-t-4 border-primary w-full"></div>
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start md:col-span-2">
            <div className="flex items-center mb-4">
              <ShieldCheck className="h-10 w-10 text-white dark:text-black" />
              <div className="ml-2 flex flex-col">
                <span className="text-3xl font-bold text-white dark:text-black leading-none">CipherLock</span>
                <span className="text-sm text-gray-400 dark:text-gray-600">by InstantDone</span>
              </div>
            </div>
            <p className="text-sm">Secure, client-side file encryption.</p>
          </div>

          <div>
            <h3 className="font-semibold text-white dark:text-black mb-4 uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white dark:text-black mb-4 uppercase tracking-wider">Other Apps</h3>
            <ul className="space-y-2">
                {otherApps.map((app) => (
                    <li key={app.name}>
                        <a href={app.href} className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2">
                           {React.cloneElement(app.icon, {className: "h-5 w-5"})}
                           <span>{app.name}</span>
                        </a>
                    </li>
                ))}
                <li><Link href="/privacy-policy" className="hover:text-primary transition-colors mt-2 inline-block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 dark:border-gray-200 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CipherLock by InstantDone. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
