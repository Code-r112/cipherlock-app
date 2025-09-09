"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Unlock } from "lucide-react";
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
        <div className="space-y-2">
          <Label htmlFor="file-decrypt">File to Decrypt</Label>
          <Input id="file-decrypt" type="file" accept=".ciph" onChange={handleFileChange} className="file:text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key-decrypt">Secret Key</Label>
          <Input id="key-decrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" />
        </div>
        <Button onClick={handleDecrypt} disabled={loading || !file || !key} className="w-full h-11 text-base">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Unlock className="mr-2 h-5 w-5" />}
          Decrypt & Download
        </Button>
      </CardContent>
    </Card>
  );
}
