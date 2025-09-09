import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, ShieldCheck, KeyRound, FastForward } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Strong Encryption',
    description: 'Utilizes AES (Advanced Encryption Standard) for robust and secure file protection.',
  },
  {
    icon: <KeyRound className="h-10 w-10 text-primary" />,
    title: 'Password Protection',
    description: 'Your files are encrypted with a secret key, ensuring only you can access them.',
  },
  {
    icon: <FastForward className="h-10 w-10 text-primary" />,
    title: 'Simple & Fast',
    description: 'A user-friendly interface for quick encryption and decryption right in your browser.',
  },
];

const faqItems = [
    {
        value: "item-1",
        question: "What is CipherLock?",
        answer: "CipherLock is a simple, browser-based tool that allows you to securely encrypt and decrypt your files using the AES encryption standard. It's designed for ease of use without compromising on security."
    },
    {
        value: "item-2",
        question: "Is CipherLock secure?",
        answer: "Yes. CipherLock uses the Advanced Encryption Standard (AES), which is a widely trusted and globally used encryption algorithm. All encryption and decryption happens locally in your browser, so your files and keys are never sent to a server."
    },
    {
        value: "item-3",
        question: "What happens if I forget my secret key?",
        answer: "Your secret key is the only way to decrypt your files. If you forget it, there is no way to recover it or your encrypted file. Please store your keys securely."
    },
    {
        value: "item-4",
        question: "What kind of files can I encrypt?",
        answer: "You can encrypt any type of file. The encrypted file will be saved with a '.ciph' extension."
    }
]

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary tracking-wider">CipherLock</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            AES file encryption and decryption. Simple &amp; Secure.
          </p>
        </div>

        <section id="features" className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card border-border/60 text-center">
                        <CardContent className="p-6">
                            <div className="mb-4 inline-block ">{feature.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <div className="w-full max-w-2xl mx-auto mb-16">
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

        <section id="faq" className="w-full max-w-2xl mx-auto">
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
