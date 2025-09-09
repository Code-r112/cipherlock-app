"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import CryptoJS from 'crypto-js';

export function EncryptPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleEncrypt = () => {
    if (!file || !key) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select a file and enter a secret key.",
      });
      return;
    }

    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ data: dataUrl, name: file.name }), key).toString();

        const blob = new Blob([encrypted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name}.ciph`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Encryption Successful",
          description: "Your file has been encrypted and downloaded.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Encryption Failed",
          description: "An error occurred during encryption. Please try again.",
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

    reader.readAsDataURL(file);
  };

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Encrypt File</CardTitle>
        <CardDescription>Select a file and provide a key to create an encrypted copy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file-encrypt">File to Encrypt</Label>
          <Input id="file-encrypt" type="file" onChange={handleFileChange} className="file:text-foreground" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="key-encrypt">Secret Key</Label>
          <Input id="key-encrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" />
        </div>
        <Button onClick={handleEncrypt} disabled={loading || !file || !key} className="w-full h-11 text-base">
          {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Lock className="mr-2 h-5 w-5" />}
          Encrypt & Download
        </Button>
      </CardContent>
    </Card>
  );
}
