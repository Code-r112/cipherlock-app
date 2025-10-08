
"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, CheckCircle, Files, KeyRound, Fingerprint, Copy, Share2 } from "lucide-react";
import * as forge from 'node-forge';
import { Textarea } from '../ui/textarea';

export function SignPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateKeys = () => {
    setLoading(true);
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

    setPrivateKey(privateKeyPem);
    setPublicKey(publicKeyPem);
    setLoading(false);
    toast({ title: 'Keys Generated', description: 'Your public/private key pair is ready. Save them securely.' });
  }

  const handleSignFile = () => {
    if (!file || !privateKey) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a file and provide your private key.",
      });
      return;
    }
    
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const fileData = e.target?.result as ArrayBuffer;
            const md = forge.md.sha256.create();
            md.update(forge.util.binary.raw.encode(new Uint8Array(fileData)));
            
            const pkiPrivateKey = forge.pki.privateKeyFromPem(privateKey);
            const signature = pkiPrivateKey.sign(md);

            const signatureHex = forge.util.bytesToHex(signature);

            const signatureBlob = new Blob([signatureHex], { type: 'text/plain' });
            const url = URL.createObjectURL(signatureBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name}.sig`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            toast({ title: 'Signature Created', description: `Signature file ${file.name}.sig has been downloaded.` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Signing Error', description: 'Could not sign file. Check your private key format.' });
        } finally {
            setLoading(false);
        }
    };
    reader.readAsArrayBuffer(file);
  };
  
  const handleCopyKey = (key: string, type: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: `Copied ${type} Key`, description: 'The key has been copied to your clipboard.' });
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Sign File</CardTitle>
        <CardDescription>Create a digital signature to verify a file's authenticity and integrity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">

         <div className="space-y-2">
            <Label className="text-lg font-semibold">Generate a New Key Pair</Label>
            <p className="text-sm text-muted-foreground">If you don't have a key pair, generate one now. Keep your private key secret!</p>
            <Button onClick={handleGenerateKeys} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
                Generate Keys
            </Button>
        </div>

        {publicKey && (
            <div className="space-y-2">
                <Label htmlFor="public-key">Your Public Key (Share Freely)</Label>
                <div className="flex gap-2">
                    <Textarea id="public-key" value={publicKey} readOnly rows={4} />
                    <Button variant="ghost" size="icon" onClick={() => handleCopyKey(publicKey, 'Public')}><Copy/></Button>
                </div>
            </div>
        )}

        <div className="space-y-4">
             <div className="space-y-2">
                <Label htmlFor="private-key" className="text-lg font-semibold">Step 1: Provide Private Key</Label>
                <div className="flex gap-2">
                    <Textarea id="private-key" placeholder="Paste your PEM-formatted private key here" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} rows={4}/>
                    <Button variant="ghost" size="icon" onClick={() => handleCopyKey(privateKey, 'Private')} disabled={!privateKey}><Copy/></Button>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="file-sign" className="text-lg font-semibold">Step 2: Upload File to Sign</Label>
                <Input id="file-sign" type="file" onChange={handleFileChange} className="file:text-foreground h-12 text-base"/>
            </div>

            <div className="space-y-2">
                <Label className="text-lg font-semibold">Step 3: Sign & Download</Label>
                <Button onClick={handleSignFile} disabled={loading || !file || !privateKey} className="w-full h-14 text-lg rounded-full">
                    {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Fingerprint className="mr-2 h-6 w-6" />}
                    Sign & Download Signature
                </Button>
            </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
