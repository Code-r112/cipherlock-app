import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock } from 'lucide-react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from '@/components/ui/card';
import placeholderImages from '@/lib/placeholder-images.json';

const features = [
    {
      image: placeholderImages.batchProcessing,
      title: 'Batch Processing',
      description: 'Encrypt or decrypt multiple files at once, streamlining your workflow.',
    },
    {
      image: placeholderImages.strongEncryption,
      title: 'Strong Encryption',
      description: 'Utilizes AES-256 for robust, industry-standard file protection.',
    },
    {
      image: placeholderImages.secretKey,
      title: 'Secret Key Control',
      description: 'You control the secret key, ensuring only you can access your files.',
    },
    {
      image: placeholderImages.noServer,
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
  const { hero } = placeholderImages;
  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 mb-24">
            <div className="text-center md:text-left">
              <h1 className="text-8xl font-bold tracking-wider">CipherLock</h1>
              <p className="text-muted-foreground mt-4 text-xl">
                A suite of tools for client-side encryption. Simple &amp; Secure.
              </p>
            </div>
            <div className="flex justify-center">
                <Image 
                    src={hero.src}
                    alt={hero.alt}
                    width={hero.width}
                    height={hero.height}
                    data-ai-hint={hero.hint}
                    className="rounded-lg"
                />
            </div>
        </div>
        
        <div className="w-full max-w-md mx-auto mb-24">
            <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14">
                <TabsTrigger value="encrypt" className="text-lg">
                  <Lock className="mr-2 h-6 w-6" />Encrypt Files
                </TabsTrigger>
                <TabsTrigger value="decrypt" className="text-lg">
                  <Unlock className="mr-2 h-6 w-6" />Decrypt Files
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

        <section id="features" className="mb-24">
            <h2 className="text-6xl font-bold text-center mb-12">Features</h2>
            <div className="grid md:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card border-none text-center">
                        <CardContent className="p-6 flex flex-col items-center">
                            <Image 
                                src={feature.image.src}
                                alt={feature.image.alt}
                                width={feature.image.width}
                                height={feature.image.height}
                                data-ai-hint={feature.image.hint}
                                className="mb-6 rounded-lg"
                            />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section id="faq" className="w-full max-w-3xl mx-auto">
            <h2 className="text-6xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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
