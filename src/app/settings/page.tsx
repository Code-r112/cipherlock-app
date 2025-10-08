
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, LogOut, Trash, Palette, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || !mounted) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">Settings</h1>
        <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
          Manage your account and preferences.
        </p>
      </header>

      <div className="space-y-12">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Profile</CardTitle>
            <CardDescription>
              This is your public information. It's not currently editable.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="text-xl font-semibold">{user.displayName}</div>
                <div className="text-muted-foreground">{user.email}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Palette/> Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-lg">Theme</Label>
              <p className="text-sm text-muted-foreground mb-2">Select your preferred color scheme.</p>
              <div className='flex gap-2'>
                <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}><Sun className="mr-2 h-5 w-5"/>Light</Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}><Moon className="mr-2 h-5 w-5"/>Dark</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Section */}
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="text-2xl text-destructive">Account Actions</CardTitle>
                <CardDescription>
                    Manage your account session and data.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-border p-4">
                    <div>
                        <h3 className="font-semibold text-lg">Log Out</h3>
                        <p className="text-sm text-muted-foreground">End your current session on this device.</p>
                    </div>
                    <Button variant="outline" onClick={signOut} className="mt-2 sm:mt-0">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Log Out
                    </Button>
                </div>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <div>
                        <h3 className="font-semibold text-lg text-destructive">Delete Account</h3>
                        <p className="text-sm text-destructive/80">Permanently delete your account and all associated data. This action is irreversible.</p>
                    </div>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                             <Button variant="destructive" className="mt-2 sm:mt-0">
                                <Trash className="mr-2 h-4 w-4"/>
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account,
                                saved keys, and activity history.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => alert("Account deletion is not yet implemented.")}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    