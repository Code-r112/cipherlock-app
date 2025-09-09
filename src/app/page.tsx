import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-primary tracking-wider">CipherLock</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            AES file encryption and decryption. Simple &amp; Secure.
          </p>
        </div>
        <Tabs defaultValue="encrypt" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="encrypt" className="text-base">
              <Lock className="mr-2 h-5 w-5" />Encrypt
            </TabsTrigger>
            <TabsTrigger value="decrypt" className="text-base">
              <Unlock className="mr-2 h-5 w-5" />Decrypt
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
  );
}