
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome } from 'lucide-react';

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
        <div className="w-full max-w-md mx-auto animate-fade-in-up">
            <Card className="w-full max-w-md border-none">
                <CardHeader className="text-center">
                <CardTitle className="text-5xl font-bold">Access All Features</CardTitle>
                <CardDescription className="text-xl pt-2">Sign in to unlock AI-powered features and more.</CardDescription>
                </CardHeader>
                <CardContent>
                <Button 
                    onClick={signInWithGoogle} 
                    className="w-full h-16 text-xl border-2 border-black" 
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
