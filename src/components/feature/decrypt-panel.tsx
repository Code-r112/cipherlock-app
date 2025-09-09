"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Unlock, FileUp, KeyRound, Download, CheckCircle, Circle } from "lucide-react";
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


export function DecryptPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleDecrypt = () => {
    if (!file || !key) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a file and enter the secret key.",
      });
      return;
    }
    
    setLoading(true);
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
        
        toast({
          title: "Decryption Successful",
          description: "Your file has been decrypted and downloaded.",
        });

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Decryption Failed",
          description: "Please check your key and file, then try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the selected file.",
        });
        setLoading(false);
    }

    reader.readAsText(file);
  };
  
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Decrypt File</CardTitle>
        <CardDescription>Select a .ciph file and provide the key to decrypt it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${file ? 'bg-green-500' : 'bg-primary'} text-primary-foreground`}>
                {file ? <CheckCircle className="w-5 h-5" /> : <FileUp className="w-5 h-5" />}
                </div>
                <div className="h-10 w-px bg-border my-1"></div>
            </div>
            <div className={`flex-1 space-y-2 pb-10 ${file ? 'opacity-100' : 'opacity-60'}`}>
                <Label htmlFor="file-decrypt" className="text-base font-semibold">Step 1: Upload .ciph File</Label>
                <Input id="file-decrypt" type="file" accept=".ciph" onChange={handleFileChange} className="file:text-foreground" disabled={!!file} />
                 {file && <p className="text-sm text-muted-foreground pt-2">Selected: {file.name}</p>}
            </div>
        </div>

        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${key ? 'bg-green-500' : !file ? 'bg-muted' : 'bg-primary'} ${!file ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
                    {key ? <CheckCircle className="w-5 h-5" /> : !file ? <Circle className="w-5 h-5" /> : <KeyRound className="w-5 h-5" />}
                </div>
              <div className="h-10 w-px bg-border my-1"></div>
            </div>
            <div className={`flex-1 space-y-2 pb-10 ${file ? 'opacity-100' : 'opacity-60'}`}>
              <Label htmlFor="key-decrypt" className="text-base font-semibold">Step 2: Enter Secret Key</Label>
              <Input id="key-decrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" disabled={!file} />
            </div>
        </div>
        
        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${!file || !key ? 'bg-muted' : 'bg-primary'} ${!file || !key ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
                 {!file || !key ? <Circle className="w-5 h-5" /> : <Download className="w-5 h-5" />}
              </div>
            </div>
            <div className={`flex-1 space-y-2 ${file && key ? 'opacity-100' : 'opacity-60'}`}>
              <Label className="text-base font-semibold">Step 3: Decrypt & Download</Label>
              <Button onClick={handleDecrypt} disabled={loading || !file || !key} className="w-full h-11 text-base">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Unlock className="mr-2 h-5 w-5" />}
                Decrypt & Download
              </Button>
            </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
