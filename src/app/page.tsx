import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { SecureNotes } from '@/components/feature/secure-notes';
import { PasswordTools } from '@/components/feature/password-tools';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, ShieldCheck, KeyRound, FastForward, WifiOff, Server, Globe, FileLock, FileText, Bot } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from '@/components/ui/card';

const features = [
    {
      icon: <FileLock className="h-10 w-10 text-primary" />,
      title: 'Batch Processing',
      description: 'Encrypt or decrypt multiple files at once, streamlining your workflow.',
    },
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Security',
      description: 'Leverage AI for secure password generation and strength analysis.',
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: 'Secure Notes',
      description: 'Encrypt and store text snippets securely in your browser.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
      title: 'Strong Encryption',
      description: 'Utilizes AES-256 for robust, industry-standard file protection.',
    },
    {
      icon: <KeyRound className="h-10 w-10 text-primary" />,
      title: 'Secret Key Control',
      description: 'You control the secret key, ensuring only you can access your files.',
    },
    {
      icon: <Server className="h-10 w-10 text-primary" />,
      title: 'No Server Upload',
      description: 'All operations happen in your browser. Your files never leave your computer.',
    },
];

const faqItems = [
    {
        value: "item-1",
        question: "What is CipherLock?",
        answer: "CipherLock is a suite of tools for client-side encryption. It allows you to securely encrypt files, create secure notes, and generate strong passwords, all directly in your browser."
    },
    {
        value: "item-2",
        question: "Is CipherLock secure?",
        answer: "Yes. CipherLock uses the Advanced Encryption Standard (AES-256), a globally trusted encryption algorithm. All operations happen locally, so your files and keys are never sent to a server."
    },
    {
        value: "item-3",
        question: "What happens if I forget my secret key?",
        answer: "Your secret key is the only way to decrypt your files or notes. If you forget it, there is no recovery process. Please store your keys securely."
    },
    {
        value: "item-4",
        question: "What kind of files can I encrypt?",
        answer: "You can encrypt any type of file. Encrypted files will be saved with a '.ciph' extension."
    },
    {
        value: "item-5",
        question: "How does batch processing work?",
        answer: "You can select multiple files in the 'Encrypt' or 'Decrypt' panels. Each file will be processed with the same secret key and downloaded individually."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary tracking-wider">CipherLock</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            A suite of tools for client-side encryption. Simple &amp; Secure.
          </p>
        </div>
        
        <div className="w-full mx-auto mb-16">
            <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="encrypt" className="text-base">
                  <Lock className="mr-2 h-5 w-5" />Encrypt Files
                </TabsTrigger>
                <TabsTrigger value="decrypt" className="text-base">
                  <Unlock className="mr-2 h-5 w-5" />Decrypt Files
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-base">
                  <FileText className="mr-2 h-5 w-5" />Secure Notes
                </TabsTrigger>
            </TabsList>
            <TabsContent value="encrypt" className="mt-6">
                <EncryptPanel />
            </TabsContent>
            <TabsContent value="decrypt" className="mt-6">
                <DecryptPanel />
            </TabsContent>
            <TabsContent value="notes" className="mt-6">
                <SecureNotes />
            </TabsContent>
            </Tabs>
        </div>

        <section id="password-tools" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">AI-Powered Password Tools</h2>
            <PasswordTools />
        </section>

        <section id="features" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card border-border/60 text-center">
                        <CardContent className="p-6 flex flex-col items-center">
                            <div className="mb-4 inline-block ">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section id="faq" className="w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map(item => (
                    <AccordionItem value={item.value} key={item.value}>
                        <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {item.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>

      </div>
    </div>
  );
}
