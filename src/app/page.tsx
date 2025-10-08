

"use client";

import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, Files, ShieldCheck, KeyRound, ServerOff, MonitorSmartphone, KeySquare, CloudOff, Bot, Activity, UploadCloud, FileType, Download, Box, Key, Repeat, Layers, Shuffle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { WordRotator } from '@/components/ui/word-rotator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnimatedLockIcon } from '@/components/ui/animated-lock-icon';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '@/components/ui/textarea';
import CryptoJS from 'crypto-js';
import { cn } from '@/lib/utils';

const features = [
    {
      icon: <Files className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-6 text-primary" />,
      title: 'Batch Processing',
      description: 'Encrypt or decrypt multiple files at once, streamlining your workflow.',
    },
    {
      icon: <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-6 text-primary" />,
      title: 'Strong Encryption',
      description: 'Utilizes AES-256 for robust, industry-standard file protection.',
    },
    {
      icon: <KeyRound className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-6 text-primary" />,
      title: 'Secret Key Control',
      description: 'You control the secret key, ensuring only you can access your files.',
    },
    {
      icon: <ServerOff className="h-10 w-10 sm:h-12 sm:w-12 mb-4 sm:mb-6 text-primary" />,
      title: 'No Server Upload',
      description: 'All operations happen in your browser. Your files never leave your computer.',
    },
];

const loggedInFeatures = [
    {
        icon: <Bot className="h-10 w-10 text-primary" />,
        title: "AI-Powered Filenaming",
        description: "Let our AI analyze your file content and suggest a secure, descriptive name, saving you time and effort."
    },
    {
        icon: <KeySquare className="h-10 w-10 text-primary" />,
        title: "Secret Key Vault",
        description: "Securely save and manage your encryption keys in your account. No more memorizing or typing long keys."
    },
    {
        icon: <Activity className="h-10 w-10 text-primary" />,
        title: "Activity Logging",
        description: "Keep a secure, private log of your encryption and decryption activities to track your actions."
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-primary" />,
        title: "Security Center",
        description: "Get personalized security recommendations from our AI based on your activity to improve your habits."
    }
]

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

function FileUploader() {
  const { user } = useAuth();
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (user) {
        router.push('/tools');
      } else {
        router.push('/auth');
      }
    }
  }, [user, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: false, noKeyboard: true });

  return (
    <div
      {...getRootProps()}
      className={`relative mt-4 mb-16 sm:mb-24 w-full max-w-lg mx-auto border-4 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 overflow-hidden group
        ${isDragActive ? 'border-solid animate-pulse-border bg-primary/20' : 'border-primary bg-radial-gradient from-primary/5 to-transparent'}
        `}
    >
        <div className="absolute inset-0 bg-dot-pattern opacity-10 -z-10"></div>
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        <div className="absolute top-0 left-[-100%] w-full h-full bg-shine-gradient transition-all duration-700 group-hover:left-[100%] -z-10"></div>
        
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-4">
        <UploadCloud className="h-20 w-20 text-foreground transition-transform duration-300 group-hover:scale-110" />
        <p className="text-3xl font-semibold text-foreground">Drag & drop your files here</p>
        <p className="text-muted-foreground">to start encrypting or decrypting</p>
      </div>
    </div>
  );
}


function LiveEncryptionDemo() {
    const demoTexts = ["Your secret passwords", "Confidential business documents", "Private medical records", "Top secret project files", "Personal family photos"];
    const [text, setText] = useState(demoTexts[0]);
    const [encryptedText, setEncryptedText] = useState('');
    const [index, setIndex] = useState(0);
    const key = 'demo-key-123'; // Simple key for demonstration

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prevIndex => (prevIndex + 1) % demoTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [demoTexts.length]);

    useEffect(() => {
        setText(demoTexts[index]);
    }, [index, demoTexts]);

    useEffect(() => {
        const encrypted = CryptoJS.AES.encrypt(text, key).toString();
        setEncryptedText(encrypted);
    }, [text]);

    return (
        <section id="live-demo" className="mb-16 sm:mb-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">See It in Action</h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-12">The animation below demonstrates how your data is instantly transformed into an unreadable, encrypted format. Your data never leaves your browser.</p>
            </div>
            <div className="grid md:grid-cols-[1fr_auto_1fr] items-center gap-8 max-w-5xl mx-auto">
                <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-center">Your Message</h3>
                    <Textarea 
                        value={text} 
                        readOnly
                        className="h-48 text-lg resize-none focus-visible:ring-0 pointer-events-none"
                        aria-label="Your Message"
                    />
                </div>
                 <div className="hidden md:flex flex-col items-center justify-center gap-4">
                    <AnimatedLockIcon />
                    <div className="w-px h-16 bg-border"></div>
                    <p className="text-muted-foreground text-sm writing-mode-vertical-rl">AES-256</p>
                    <div className="w-px h-16 bg-border"></div>
                </div>
                <div className="space-y-2">
                     <h3 className="text-2xl font-semibold text-center">Encrypted Output</h3>
                    <Textarea 
                        value={encryptedText} 
                        readOnly 
                        className="h-48 text-lg bg-secondary font-code resize-none focus-visible:ring-0 pointer-events-none"
                        aria-label="Encrypted Output"
                    />
                </div>
            </div>
        </section>
    );
}

export default function Home() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0];

  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
       <div className="absolute top-0 left-0 -z-10 h-full w-full bg-background">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(var(--primary-rgb),0.5)] opacity-50 blur-[80px]"></div>
      </div>
      <div className="w-full max-w-5xl">
        <div className="text-center pt-8 pb-16 sm:pt-12 sm:pb-24 animate-fade-in-down">
          {user && firstName ? (
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl text-muted-foreground mb-4">
              <AnimatedLockIcon />
              <p>Hello, {firstName}!</p>
            </div>
          ) : !user && (
            <Button asChild variant="secondary" className="mb-4 rounded-full border-2 border-primary text-base h-auto px-4 py-1 shine-button">
                <Link href="/auth">Unlock all features by signing in</Link>
            </Button>
          )}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider h-20 sm:h-24 md:h-28 flex items-center justify-center gap-x-3">
            Data <WordRotator words={["Encrypt", "Secure", "Protect"]} />
          </h1>
          <p className="text-muted-foreground mt-4 text-lg sm:text-2xl">
            A suite of tools for client-side encryption. Simple &amp; Secure.
          </p>
        </div>
        
        {user ? (
            <div className="mt-4 mb-16 sm:mb-24 flex justify-center">
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shine-button">
                    <Link href="/tools">
                        <Lock className="mr-3 h-5 w-5" />
                        Go to Encryption Tools
                    </Link>
                </Button>
            </div>
        ) : (
            <FileUploader />
        )}

        <LiveEncryptionDemo />

        <section id="how-it-works" className="my-16 sm:my-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Inside AES-256 Encryption</h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-12">CipherLock uses AES-256, the same encryption standard trusted by governments and security experts worldwide. Here’s a simplified look at how it masterfully turns your readable data into a secure, unreadable block.</p>
            </div>
            <div className="space-y-8">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                    <Card className="w-full lg:w-1/3 text-center">
                        <CardHeader>
                            <CardTitle>1. Input & State</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Box className="w-16 h-16 mx-auto mb-4 text-foreground"/>
                            <p>Your data is divided into 128-bit blocks and arranged into a 4x4 grid of bytes, called the "State".</p>
                        </CardContent>
                    </Card>
                    <Card className="w-full lg:w-1/3 text-center">
                         <CardHeader>
                            <CardTitle>2. Key Expansion</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Key className="w-16 h-16 mx-auto mb-4 text-foreground"/>
                            <p>Your secret key is expanded into a series of "Round Keys"—one for each encryption round.</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-center">
                    <Repeat className="w-12 h-12 mx-auto text-foreground animate-spin" style={{ animationDuration: '10s' }}/>
                    <p className="mt-2 text-lg font-semibold">Main Rounds (14 for AES-256)</p>
                    <p className="text-muted-foreground">The State is transformed in a series of identical rounds.</p>
                </div>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <Card>
                        <CardHeader><CardTitle>SubBytes</CardTitle></CardHeader>
                        <CardContent>
                            <Shuffle className="w-10 h-10 mx-auto mb-2 text-foreground"/>
                            <p className="text-sm text-muted-foreground">Each byte is swapped for another using a fixed substitution table (S-Box).</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>ShiftRows</CardTitle></CardHeader>
                        <CardContent>
                            <Layers className="w-10 h-10 mx-auto mb-2 text-foreground"/>
                            <p className="text-sm text-muted-foreground">The rows of the State grid are shifted cyclically to shuffle the data.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>MixColumns</CardTitle></CardHeader>
                        <CardContent>
                            <Box className="w-10 h-10 mx-auto mb-2 text-foreground"/>
                            <p className="text-sm text-muted-foreground">Each column is mixed using a mathematical transformation to further diffuse data.</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>AddRoundKey</CardTitle></CardHeader>
                        <CardContent>
                            <KeyRound className="w-10 h-10 mx-auto mb-2 text-foreground"/>
                            <p className="text-sm text-muted-foreground">The current Round Key is combined with the State using an XOR operation.</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="text-center">
                    <p className="mt-2 text-lg font-semibold">Final Round</p>
                    <p className="text-muted-foreground">A final, slightly different round (without MixColumns) is performed.</p>
                </div>
                 <div className="flex justify-center">
                    <Card className="w-full lg:w-1/3 text-center">
                        <CardHeader>
                            <CardTitle>3. Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-foreground"/>
                            <p>The final, fully scrambled State is the encrypted ciphertext.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        <section id="features" className="mb-16 sm:mb-24 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-12 sm:mb-16">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                {features.map((feature, index) => (
                    <Card key={index} className="bg-card border-none text-center" style={{ animationDelay: `${index * 100}ms`}}>
                        <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                            {feature.icon}
                            <h3 className="text-lg sm:text-2xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section id="security-process" className="my-16 sm:my-24 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-12 sm:mb-16">Your Security is Our Priority</h2>
            <div className="relative">
                <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
                <div className="relative grid md:grid-cols-3 gap-8 md:gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="relative bg-background p-2">
                           <div className="bg-primary/10 text-primary p-4 sm:p-6 rounded-full mb-4 sm:mb-6 ring-8 ring-background">
                                <MonitorSmartphone className="h-12 w-12 sm:h-16 sm:w-16" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">1. Purely Local</h3>
                        <p className="text-muted-foreground text-base sm:text-lg">All encryption and decryption happens in your browser. Your private files never leave your machine.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="relative bg-background p-2">
                            <div className="bg-primary/10 text-primary p-4 sm:p-6 rounded-full mb-4 sm:mb-6 ring-8 ring-background">
                                <KeySquare className="h-12 w-12 sm:h-16 sm:w-16" />
                            </div>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">2. You Hold the Keys</h3>
                        <p className="text-muted-foreground text-base sm:text-lg">You provide the secret key for every operation. We don't store, transmit, or have any access to it.</p>
                    </div>
                     <div className="flex flex-col items-center">
                        <div className="relative bg-background p-2">
                           <div className="bg-primary/10 text-primary p-4 sm:p-6 rounded-full mb-4 sm:mb-6 ring-8 ring-background">
                               <CloudOff className="h-12 w-12 sm:h-16 sm:w-16" />
                           </div>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-semibold mb-2 sm:mb-4">3. Zero Data Storage</h3>
                        <p className="text-muted-foreground text-base sm:text-lg">Your original files and their encrypted versions are never stored by us. They are processed in memory and then saved back to your device.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="premium-features" className="mb-16 sm:mb-24 animate-fade-in-up bg-secondary rounded-2xl py-12 sm:py-16 px-6" style={{ animationDelay: '0.4s' }}>
            <div className="text-center max-w-3xl mx-auto">
                 <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Unlock More with an Account</h2>
                 <p className="text-lg sm:text-xl text-muted-foreground mb-12">Signing up is free and gives you access to a powerful suite of features designed for convenience and enhanced security.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {loggedInFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4" style={{ animationDelay: `${index * 150}ms`}}>
                        <div className="flex-shrink-0 bg-background p-3 rounded-full shadow-md">
                           {feature.icon}
                        </div>
                        <div>
                           <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                           <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section id="faq" className="w-full max-w-3xl mx-auto animate-fade-in-up pb-12" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-12 sm:mb-16">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                    <AccordionItem value={item.value} key={item.value} style={{ animationDelay: `${index * 150}ms`}}>
                        <AccordionTrigger className="text-lg sm:text-xl text-left">{item.question}</AccordionTrigger>
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

    

    










    

    