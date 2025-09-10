
"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Unlock, KeyRound, Download, CheckCircle, Files, Sparkles, Copy } from "lucide-react";
import CryptoJS from 'crypto-js';
import { Progress } from '@/components/ui/progress';

function dataUriToBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
}

const checkKeyStrength = (key: string) => {
    let score = 0;
    if (key.length >= 8) score++;
    if (key.length >= 12) score++;
    if (/[A-Z]/.test(key)) score++;
    if (/[a-z]/.test(key)) score++;
    if (/[0-9]/.test(key)) score++;
    if (/[^A-Za-z0-9]/.test(key)) score++;

    if (score < 3) return { level: "Weak", value: (score / 6) * 100, color: "bg-red-500" };
    if (score < 5) return { level: "Medium", value: (score / 6) * 100, color: "bg-yellow-500" };
    return { level: "Strong", value: (score / 6) * 100, color: "bg-green-500" };
};

export function DecryptPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleGenerateKey = () => {
    const randomKey = Array.from(window.crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => String.fromCharCode(b))
      .join('')
      .replace(/[^a-zA-Z0-9!@#$%^&*()_+-=[]{}|;:,.<>?]/g, '')
      .slice(0, 32);
    setKey(randomKey);
  };
  
  const handleCopyKey = () => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Key Copied",
      description: "The secret key has been copied to your clipboard.",
    });
  };

  const handleDecrypt = () => {
    if (files.length === 0 || !key) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select one or more files and enter the secret key.",
      });
      return;
    }
    
    setLoading(true);
    let processedCount = 0;
    let successCount = 0;

    files.forEach(file => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const encryptedContent = e.target?.result as string;
            const bytes = CryptoJS.AES.decrypt(encryptedContent, key);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            
            if (!decryptedData) {
                throw new Error("Decryption failed. Wrong key or corrupted file.");
            }

            const { data, name } = JSON.parse(decryptedData);

            const blob = dataUriToBlob(data);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            successCount++;

          } catch (error) {
            toast({
              variant: "destructive",
              title: `Decryption Failed for ${file.name}`,
              description: "Please check your key and the file.",
            });
          } finally {
            processedCount++;
            if (processedCount === files.length) {
              setLoading(false);
              toast({
                title: "Decryption Complete",
                description: `${successCount} of ${files.length} file(s) decrypted.`,
              });
            }
          }
        };
        
        reader.onerror = () => {
            toast({
                variant: "destructive",
                title: `File Read Error for ${file.name}`,
                description: "Could not read the selected file.",
            });
            processedCount++;
            if (processedCount === files.length) {
              setLoading(false);
            }
        }
        reader.readAsText(file);
    });
  };

  const step1Completed = files.length > 0;
  const step2Completed = key.length > 0;
  const keyStrength = checkKeyStrength(key);
  
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle className="text-2xl">Decrypt File(s)</CardTitle>
        <CardDescription>Select .ciph files and provide the key to decrypt them.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        
        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step1Completed ? 'bg-primary/80' : 'bg-primary'} text-primary-foreground`}>
                {step1Completed ? <CheckCircle className="w-6 h-6" /> : <Files className="w-6 h-6" />}
                </div>
                <div className="h-10 w-px bg-border my-1"></div>
            </div>
            <div className="flex-1 space-y-2 pb-10">
                <Label htmlFor="file-decrypt" className="text-lg font-semibold">Step 1: Upload .ciph File(s)</Label>
                <Input id="file-decrypt" type="file" accept=".ciph" onChange={handleFileChange} className="file:text-foreground h-12 text-base" multiple disabled={step1Completed}/>
                 {step1Completed && <p className="text-base text-muted-foreground pt-2">Selected: {files.length} file(s)</p>}
            </div>
        </div>

        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step2Completed ? 'bg-primary/80' : !step1Completed ? 'bg-muted' : 'bg-primary'} ${!step1Completed ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
                    {step2Completed ? <CheckCircle className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
                </div>
              <div className="h-10 w-px bg-border my-1"></div>
            </div>
            <div className={`flex-1 space-y-2 pb-10 transition-opacity ${step1Completed ? 'opacity-100' : 'opacity-60'}`}>
              <Label htmlFor="key-decrypt" className="text-lg font-semibold">Step 2: Enter Secret Key</Label>
              <div className="flex items-center gap-2">
                <Input id="key-decrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" disabled={!step1Completed} className="h-12 text-base" />
                <Button variant="outline" size="icon" onClick={handleGenerateKey} disabled={!step1Completed}><Sparkles className="w-5 h-5"/></Button>
                <Button variant="outline" size="icon" onClick={handleCopyKey} disabled={!key}><Copy className="w-5 h-5"/></Button>
              </div>
              {key && (
                <div className="pt-2 space-y-1">
                  <Progress value={keyStrength.value} className={`h-2 ${keyStrength.color}`} />
                  <p className="text-sm font-medium" style={{ color: keyStrength.color.replace('bg-', '').replace('-500', '')}}>{keyStrength.level}</p>
                </div>
              )}
            </div>
        </div>
        
        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${!step1Completed || !step2Completed ? 'bg-muted' : 'bg-primary'} ${!step1Completed || !step2Completed ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
                 <Download className="w-6 h-6" />
              </div>
            </div>
            <div className={`flex-1 space-y-2 transition-opacity ${step1Completed && step2Completed ? 'opacity-100' : 'opacity-60'}`}>
              <Label className="text-lg font-semibold">Step 3: Decrypt & Download</Label>
              <Button onClick={handleDecrypt} disabled={loading || !step1Completed || !step2Completed} className="w-full h-14 text-lg">
                {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Unlock className="mr-2 h-6 w-6" />}
                Decrypt & Download
              </Button>
            </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
