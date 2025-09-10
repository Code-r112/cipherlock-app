
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

export default function AuthPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const { auth: authImage } = placeholderImages;

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="grid md:grid-cols-2 gap-16 items-center max-w-4xl mx-auto">
            <div className="hidden md:flex justify-center">
                 <Image 
                    src={authImage.src}
                    alt={authImage.alt}
                    width={authImage.width}
                    height={authImage.height}
                    data-ai-hint={authImage.hint}
                    className="rounded-lg"
                />
            </div>
            <Card className="w-full max-w-md border-none">
                <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold">Access All Features</CardTitle>
                <CardDescription className="text-lg">Sign in to unlock AI-powered features and more.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button 
                    onClick={signInWithGoogle} 
                    className="w-full h-16 text-xl" 
                    disabled={loading}
                    size="lg"
                >
                    <Chrome className="mr-2 h-7 w-7" />
                    Continue with Google
                </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
