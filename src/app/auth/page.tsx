
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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Access All Features</CardTitle>
          <CardDescription className="text-lg">Sign in to unlock the full potential of CipherLock.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={signInWithGoogle} 
            className="w-full h-14 text-lg" 
            disabled={loading}
            size="lg"
          >
            <Chrome className="mr-2 h-6 w-6" />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
