
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Bot, KeySquare, Activity, ShieldCheck } from 'lucide-react';

const featuresToUnlock = [
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "AI-Powered Filenaming",
        description: "Let AI suggest secure, descriptive names for your files."
    },
    {
        icon: <KeySquare className="h-8 w-8 text-primary" />,
        title: "Secret Key Vault",
        description: "Securely save and manage your encryption keys in your account."
    },
    {
        icon: <Activity className="h-8 w-8 text-primary" />,
        title: "Activity Logging",
        description: "Keep a private log of your encryption and decryption activities."
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-primary" />,
        title: "Security Center",
        description: "Get personalized security recommendations from our AI."
    }
]

export default function AuthPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
            <Card className="w-full border-none">
                <CardHeader className="text-center">
                <CardTitle className="text-5xl font-bold">Access All Features</CardTitle>
                <CardDescription className="text-xl pt-2">Sign in to unlock your secure key vault, AI-powered tools, activity history, and more.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8">
                <Button 
                    onClick={signInWithGoogle} 
                    className="w-full max-w-md h-16 text-xl" 
                    disabled={loading}
                    size="lg"
                >
                    <Chrome className="mr-2 h-7 w-7" />
                    Continue with Google
                </Button>
                <div className="w-full max-w-lg space-y-6 text-left pt-8">
                     {featuresToUnlock.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-secondary p-3 rounded-full">
                               {feature.icon}
                            </div>
                            <div>
                               <h3 className="text-lg font-semibold">{feature.title}</h3>
                               <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
