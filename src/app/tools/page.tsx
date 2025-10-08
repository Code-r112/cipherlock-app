
"use client";

import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center pt-8 pb-16 sm:pt-12 sm:pb-24 animate-fade-in-down">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider">
            Encryption Tools
          </h1>
          <p className="text-muted-foreground mt-4 text-lg sm:text-2xl">
            Encrypt and decrypt your files with confidence.
          </p>
        </div>
        
        <div className="w-full max-w-lg mx-auto mb-16 sm:mb-24 animate-fade-in-up">
            <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 sm:h-16 gap-2 bg-transparent p-0">
                <TabsTrigger value="encrypt" className="text-lg sm:text-xl h-full rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted">
                  <Lock className="mr-2 h-6 w-6 sm:h-7 sm:w-7" />Encrypt Files
                </TabsTrigger>
                <TabsTrigger value="decrypt" className="text-lg sm:text-xl h-full rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted">
                  <Unlock className="mr-2 h-6 w-6 sm:h-7 sm:w-7" />Decrypt Files
                </TabsTrigger>
            </TabsList>
            <TabsContent value="encrypt" className="mt-6">
                <EncryptPanel />
            </TabsContent>
            <TabsContent value="decrypt" className="mt-6">
                <DecryptPanel />
            </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
