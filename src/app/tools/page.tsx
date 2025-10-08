

"use client";

import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, MonitorSmartphone, ShieldCheck, Download, KeySquare, FileType } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AnimatedLockIcon } from '@/components/ui/animated-lock-icon';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function ToolsPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0];

  const TreeNode = ({ icon, title, description, children }: { icon: React.ReactNode, title: string, description: string, children?: React.ReactNode }) => (
      <div className="flex flex-col items-center text-center relative group/treenode">
          <div className="relative z-10">
              <div className="transition-all duration-300 group-hover/treenode:scale-105 group-hover/treenode:shadow-2xl bg-background border-2 border-border p-6 rounded-2xl w-64 h-full flex flex-col items-center">
                  <div className="mb-4 text-primary transition-colors duration-300 group-hover/treenode:text-accent-foreground">{icon}</div>
                  <h3 className="font-bold text-xl mb-2 transition-colors duration-300 group-hover/treenode:text-accent-foreground">{title}</h3>
                  <p className="text-base text-muted-foreground">{description}</p>
              </div>
          </div>
          {children && (
              <>
                  <div className="mt-8 w-px h-8 bg-border"></div>
                  <div className="flex justify-center w-full relative">
                      <div className="absolute top-0 h-px bg-border" style={{ width: `calc(100% - 4rem)` }}></div>
                      {children}
                  </div>
              </>
          )}
      </div>
  );
  
  const TreeContainer = ({ children }: { children: React.ReactNode }) => (
      <div className="flex justify-center">
          {children}
      </div>
  );
  
  const SubTree = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-around w-full gap-8 pt-8">
        {children}
    </div>
  );


  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl">
      <Breadcrumb />
        <div className="text-center pt-8 pb-16 sm:pt-12 sm:pb-24 animate-fade-in-down">
          {user && firstName && (
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl text-muted-foreground mb-4">
              <AnimatedLockIcon />
              <p>Hello, {firstName}!</p>
            </div>
          )}
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

        <section id="how-it-works" className="mb-16 sm:mb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">How It Works</h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-12">CipherLock ensures your privacy by performing all encryption and decryption locally on your device. Your files are never uploaded to any server.</p>
            </div>
            <div className="max-w-5xl mx-auto overflow-x-auto p-4">
                <TreeContainer>
                    <TreeNode title="Your File & Key" description="The process begins with your file and a unique key you provide, all on your local machine." icon={<FileType className="w-10 h-10" />}>
                        <SubTree>
                            <TreeNode title="In-Browser Reading" description="File is read into the browser's memory, never leaving your computer." icon={<MonitorSmartphone className="w-10 h-10" />}>
                                <SubTree>
                                    <TreeNode title="AES-256 Encryption" description="Content is encrypted with your key using a military-grade algorithm." icon={<ShieldCheck className="w-10 h-10" />}>
                                        <SubTree>
                                            <TreeNode title="Encrypted Download" description="The result is securely packaged and downloaded back to you as a '.ciph' file." icon={<Download className="w-10 h-10" />} />
                                        </SubTree>
                                    </TreeNode>
                                </SubTree>
                            </TreeNode>
                            <TreeNode title="Key Hashing (Optional)" description="If you're logged in, a hash of the key is stored for security analysis, not the key itself." icon={<KeySquare className="w-10 h-10" />} />
                        </SubTree>
                    </TreeNode>
                </TreeContainer>
            </div>
        </section>

      </div>
    </div>
  );
}
