
import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, Files, ShieldCheck, KeyRound, ServerOff, MonitorSmartphone, KeySquare, CloudOff } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from '@/components/ui/card';

const features = [
    {
      icon: <Files className="h-12 w-12 mb-6 text-primary" />,
      title: 'Batch Processing',
      description: 'Encrypt or decrypt multiple files at once, streamlining your workflow.',
    },
    {
      icon: <ShieldCheck className="h-12 w-12 mb-6 text-primary" />,
      title: 'Strong Encryption',
      description: 'Utilizes AES-256 for robust, industry-standard file protection.',
    },
    {
      icon: <KeyRound className="h-12 w-12 mb-6 text-primary" />,
      title: 'Secret Key Control',
      description: 'You control the secret key, ensuring only you can access your files.',
    },
    {
      icon: <ServerOff className="h-12 w-12 mb-6 text-primary" />,
      title: 'No Server Upload',
      description: 'All operations happen in your browser. Your files never leave your computer.',
    },
];

const faqItems = [
    {
        value: "item-1",
        question: "What is CipherLock?",
        answer: "CipherLock is a tool for client-side file encryption. It allows you to securely encrypt and decrypt files directly in your browser."
    },
    {
        value: "item-2",
        question: "Is CipherLock secure?",
        answer: "Yes. CipherLock uses the Advanced Encryption Standard (AES-256), a globally trusted encryption algorithm. All operations happen locally, so your files and keys are never sent to a server."
    },
    {
        value: "item-3",
        question: "What happens if I forget my secret key?",
        answer: "Your secret key is the only way to decrypt your files. If you forget it, there is no recovery process. Please store your keys securely."
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
      <div className="w-full max-w-5xl">
        <div className="text-center py-24 animate-fade-in-down">
          <h1 className="text-9xl font-bold tracking-wider">CipherLock</h1>
          <p className="text-muted-foreground mt-4 text-2xl">
            A suite of tools for client-side encryption. Simple &amp; Secure.
          </p>
        </div>
        
        <div className="w-full max-w-lg mx-auto mb-24 animate-fade-in-up">
            <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-16 gap-2 bg-transparent p-0">
                <TabsTrigger value="encrypt" className="text-xl h-full rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted">
                  <Lock className="mr-2 h-7 w-7" />Encrypt Files
                </TabsTrigger>
                <TabsTrigger value="decrypt" className="text-xl h-full rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted">
                  <Unlock className="mr-2 h-7 w-7" />Decrypt Files
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

        <section id="features" className="mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-7xl font-bold text-center mb-16">Features</h2>
            <div className="grid md:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card border-none text-center">
                        <CardContent className="p-6 flex flex-col items-center">
                            {feature.icon}
                            <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section id="security-process" className="mb-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-7xl font-bold text-center mb-16">Your Security is Our Priority</h2>
            <div className="relative">
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                <div className="relative grid md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="relative bg-background p-2">
                           <div className="bg-primary/10 text-primary p-6 rounded-full mb-6 ring-8 ring-background">
                                <MonitorSmartphone className="h-16 w-16" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-semibold mb-4">1. Purely Local</h3>
                        <p className="text-muted-foreground text-lg">All encryption and decryption happens in your browser. Your private files never leave your machine.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="relative bg-background p-2">
                            <div className="bg-primary/10 text-primary p-6 rounded-full mb-6 ring-8 ring-background">
                                <KeySquare className="h-16 w-16" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-semibold mb-4">2. You Hold the Keys</h3>
                        <p className="text-muted-foreground text-lg">You provide the secret key for every operation. We don't store, transmit, or have any access to it.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="relative bg-background p-2">
                           <div className="bg-primary/10 text-primary p-6 rounded-full mb-6 ring-8 ring-background">
                               <CloudOff className="h-16 w-16" />
                           </div>
                        </div>
                        <h3 className="text-3xl font-semibold mb-4">3. Zero Data Storage</h3>
                        <p className="text-muted-foreground text-lg">Your original files and their encrypted versions are never stored by us. They are processed in memory and then saved back to your device.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="faq" className="w-full max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-7xl font-bold text-center mb-16">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map(item => (
                    <AccordionItem value={item.value} key={item.value}>
                        <AccordionTrigger className="text-xl text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-lg text-muted-foreground">
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
