
"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, ShieldAlert, Fingerprint, XCircle } from "lucide-react";
import * as forge from 'node-forge';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type VerificationStatus = 'idle' | 'verified' | 'failed';

export function VerifyPanel() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [publicKey, setPublicKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>('idle');
  const { toast } = useToast();


  const handleVerify = () => {
    if (!originalFile || !signatureFile || !publicKey) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide the original file, signature file, and public key.",
      });
      return;
    }
    
    setLoading(true);
    setStatus('idle');

    const originalReader = new FileReader();
    const signatureReader = new FileReader();

    let originalData: ArrayBuffer;
    let signatureData: string;
    
    let filesRead = 0;
    const totalFiles = 2;

    const onFileRead = () => {
        filesRead++;
        if (filesRead === totalFiles) {
            performVerification();
        }
    }

    originalReader.onload = (e) => {
        originalData = e.target?.result as ArrayBuffer;
        onFileRead();
    };

    signatureReader.onload = (e) => {
        signatureData = e.target?.result as string;
        onFileRead();
    };

    const performVerification = () => {
        try {
            const pkiPublicKey = forge.pki.publicKeyFromPem(publicKey);
            
            const md = forge.md.sha256.create();
            md.update(forge.util.binary.raw.encode(new Uint8Array(originalData)));

            const signatureBytes = forge.util.hexToBytes(signatureData);
            
            const verified = pkiPublicKey.verify(md.digest().bytes(), signatureBytes);
            
            if (verified) {
                setStatus('verified');
                toast({ title: 'Verification Successful', description: 'The file signature is valid.' });
            } else {
                setStatus('failed');
                toast({ variant: 'destructive', title: 'Verification Failed', description: 'The signature is invalid. The file may have been tampered with.' });
            }
        } catch (error) {
            setStatus('failed');
            toast({ variant: 'destructive', title: 'Verification Error', description: 'An error occurred. Check the public key or signature file format.' });
        } finally {
            setLoading(false);
        }
    }

    originalReader.readAsArrayBuffer(originalFile);
    signatureReader.readAsText(signatureFile);
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Verify File</CardTitle>
        <CardDescription>Check if a file has been tampered with by verifying its digital signature.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">

        <div className="space-y-2">
            <Label htmlFor="original-file" className="text-lg font-semibold">Step 1: Upload Original File</Label>
            <Input id="original-file" type="file" onChange={(e) => setOriginalFile(e.target.files?.[0] || null)} className="file:text-foreground h-12 text-base"/>
        </div>

         <div className="space-y-2">
            <Label htmlFor="signature-file" className="text-lg font-semibold">Step 2: Upload Signature File (.sig)</Label>
            <Input id="signature-file" type="file" accept=".sig" onChange={(e) => setSignatureFile(e.target.files?.[0] || null)} className="file:text-foreground h-12 text-base"/>
        </div>

        <div className="space-y-2">
            <Label htmlFor="public-key-verify" className="text-lg font-semibold">Step 3: Provide Sender's Public Key</Label>
            <Textarea id="public-key-verify" placeholder="Paste the sender's PEM-formatted public key" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} rows={4}/>
        </div>
        
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Step 4: Verify</Label>
            <Button onClick={handleVerify} disabled={loading || !originalFile || !signatureFile || !publicKey} className="w-full h-14 text-lg rounded-full">
                {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Fingerprint className="mr-2 h-6 w-6" />}
                Verify Signature
            </Button>
            {status === 'verified' && (
                <Alert variant="default" className="bg-green-500/10 border-green-500/20">
                    <CheckCircle className="h-5 w-5 text-green-500"/>
                    <AlertTitle className="text-green-600">Signature Verified</AlertTitle>
                    <AlertDescription>The file is authentic and has not been tampered with.</AlertDescription>
                </Alert>
            )}
            {status === 'failed' && (
                <Alert variant="destructive">
                    <XCircle className="h-5 w-5"/>
                    <AlertTitle>Signature Invalid</AlertTitle>
                    <AlertDescription>The signature does not match the file. It may have been altered, or the key is incorrect.</AlertDescription>
                </Alert>
            )}
        </div>
        
      </CardContent>
    </Card>
  );
}
