
"use client";

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, KeyRound, PlusCircle, Trash2, Sparkles, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface SavedKey {
    id: string;
    name: string;
    key: string;
}

export default function KeysPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [keys, setKeys] = useState<SavedKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [newKeyName, setNewKeyName] = useState('');
    const [newKeyValue, setNewKeyValue] = useState('');
    const [isAddKeyDialogOpen, setAddKeyDialogOpen] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/auth');
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'keys'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userKeys: SavedKey[] = [];
            querySnapshot.forEach((doc) => {
                userKeys.push({ id: doc.id, ...doc.data() } as SavedKey);
            });
            setKeys(userKeys);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, router]);

    const handleGenerateKey = () => {
        const randomKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
          .map((b) => String.fromCharCode(b))
          .join('')
          .replace(/[^a-zA-Z0-9!@#$%^&*()_+-=[]{}|;:,.<>?]/g, '')
          .slice(0, 32);
        setNewKeyValue(randomKey);
    };

    const handleAddKey = async () => {
        if (!newKeyName || !newKeyValue) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please provide a name and value for the key." });
            return;
        }
        if (user) {
            await addDoc(collection(db, 'users', user.uid, 'keys'), { name: newKeyName, key: newKeyValue });
            toast({ title: "Key Added", description: `The key "${newKeyName}" has been added to your vault.` });
            setNewKeyName('');
            setNewKeyValue('');
            setAddKeyDialogOpen(false);
        }
    };
    
    const handleDeleteKey = async (keyId: string) => {
        if (user) {
            await deleteDoc(doc(db, 'users', user.uid, 'keys', keyId));
            toast({ title: "Key Deleted", description: `The key has been removed from your vault.` });
        }
    };
    
    const handleCopyKey = (keyValue: string) => {
        navigator.clipboard.writeText(keyValue);
        toast({
          title: "Key Copied",
          description: "The secret key has been copied to your clipboard.",
        });
    };

    const toggleKeyVisibility = (keyId: string) => {
        setVisibleKeys(prev => ({...prev, [keyId]: !prev[keyId]}));
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Breadcrumb />
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-12 gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">Key Vault</h1>
                        <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">Manage your saved secret keys.</p>
                    </div>
                     <Dialog open={isAddKeyDialogOpen} onOpenChange={setAddKeyDialogOpen}>
                        <DialogTrigger asChild>
                           <Button size="lg" className="h-14 text-lg w-full sm:w-auto"><PlusCircle className="mr-2"/>Add New Key</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a New Secret Key</DialogTitle>
                                <DialogDescription>Save a key with a friendly name so you can easily reuse it later.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="new-key-name">Key Name</Label>
                                    <Input id="new-key-name" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="e.g., 'Work Documents Key'"/>
                                </div>
                                <div>
                                    <Label htmlFor="new-key-value">Secret Key</Label>
                                    <div className="flex gap-2">
                                        <Input id="new-key-value" value={newKeyValue} onChange={(e) => setNewKeyValue(e.target.value)} placeholder="Enter or generate a key" />
                                        <Button variant="outline" size="icon" onClick={handleGenerateKey}><Sparkles/></Button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setAddKeyDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddKey}>Save Key</Button>
                            </DialogFooter>
                        </DialogContent>
                     </Dialog>
                </header>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl sm:text-2xl"><KeyRound className="mr-2"/>Your Saved Keys</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {keys.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-xl">Your vault is empty.</p>
                                <p>Add a key to get started!</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {keys.map(k => (
                                    <li key={k.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-secondary rounded-lg gap-4">
                                        <div className="flex-1 w-full">
                                            <p className="font-semibold text-lg">{k.name}</p>
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    type={visibleKeys[k.id] ? 'text' : 'password'} 
                                                    value={k.key} 
                                                    readOnly 
                                                    className="w-full sm:w-auto flex-grow bg-transparent border-none p-0 h-auto"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-auto">
                                            <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(k.id)}>
                                                {visibleKeys[k.id] ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleCopyKey(k.key)}>
                                                <Copy className="h-5 w-5"/>
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(k.id)} className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-5 w-5"/>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
