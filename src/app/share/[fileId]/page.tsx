
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSharedFile } from '@/services/share-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Unlock, KeyRound, Download, FileWarning, ShieldX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CryptoJS from 'crypto-js';

function dataUriToBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
}

export default function SharePage() {
    const params = useParams();
    const { fileId } = params;
    const [encryptedContent, setEncryptedContent] = useState<string | null>(null);
    const [key, setKey] = useState('');
    const [loading, setLoading] = useState(true);
    const [decrypting, setDecrypting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof fileId !== 'string') return;

        async function fetchFile() {
            try {
                const result = await getSharedFile({ fileId });
                if (result) {
                    setEncryptedContent(result.encryptedContent);
                } else {
                    setError('This file does not exist or has already been downloaded. Links are valid for one-time use only.');
                }
            } catch (err) {
                setError('Failed to retrieve the shared file. Please check the link and try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchFile();
    }, [fileId]);

     const handleDecrypt = () => {
        if (!encryptedContent || !key) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please enter the secret key to decrypt this file.',
            });
            return;
        }

        setDecrypting(true);
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

            if (!decryptedData) {
                throw new Error('Decryption failed. Wrong key or corrupted file.');
            }

            const payload = JSON.parse(decryptedData);
            const { data, name } = payload;
            
            const blob = dataUriToBlob(data);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({
                title: 'Decryption Successful',
                description: `The file "${name}" has been downloaded.`,
            });
            setError('This link has been used and is now invalid.');
            setEncryptedContent(null);
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: 'Decryption Failed',
                description: err.message || 'An error occurred during decryption.',
            });
        } finally {
            setDecrypting(false);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                 <header className="text-center mb-12">
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">Secure Download</h1>
                    <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">You have received a securely encrypted file.</p>
                </header>

                {error ? (
                    <Card className="border-destructive bg-destructive/10">
                        <CardHeader>
                            <CardTitle className="flex items-center text-destructive"><ShieldX className="mr-2"/>Link Invalid</CardTitle>
                        </CardHeader>
                         <CardContent>
                             <p className="text-destructive text-lg">{error}</p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center"><FileWarning className="mr-2"/>File Ready for Decryption</CardTitle>
                            <CardDescription>Enter the secret key provided by the sender to download the original file. The key is never sent to the server.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="key-decrypt" className="text-lg">Secret Key</Label>
                                <Input id="key-decrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter secret key from sender" className="h-12 text-base"/>
                            </div>
                            <Button onClick={handleDecrypt} disabled={decrypting || !key} className="w-full h-14 text-lg">
                                {decrypting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Unlock className="mr-2 h-6 w-6" />}
                                Decrypt & Download
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
