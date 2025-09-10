
"use client";

import { useState, type ChangeEvent } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, FileUp, KeyRound, Download, CheckCircle, Circle, Files } from "lucide-react";
import CryptoJS from 'crypto-js';

export function EncryptPanel() {
  const [files, setFiles] = useState<File[]>([]);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleEncrypt = () => {
    if (files.length === 0 || !key) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select one or more files and enter a secret key.",
      });
      return;
    }

    setLoading(true);
    
    let processedCount = 0;

    files.forEach(file => {
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

        } catch (error) {
          toast({
            variant: "destructive",
            title: `Encryption Failed for ${file.name}`,
            description: "An error occurred during encryption.",
          });
        } finally {
          processedCount++;
          if (processedCount === files.length) {
            setLoading(false);
            toast({
              title: "Encryption Complete",
              description: `${files.length} file(s) have been encrypted and downloaded.`,
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

      reader.readAsDataURL(file);
    });
  };

  const step1Completed = files.length > 0;
  const step2Completed = key.length > 0;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-2xl">Encrypt File(s)</CardTitle>
        <CardDescription>Select one or more files and provide a key to create encrypted copies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">

        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step1Completed ? 'bg-green-500' : 'bg-primary'} text-primary-foreground`}>
                {step1Completed ? <CheckCircle className="w-6 h-6" /> : <Files className="w-6 h-6" />}
                </div>
                <div className="h-10 w-px bg-border my-1"></div>
            </div>
            <div className="flex-1 space-y-2 pb-10">
                <Label htmlFor="file-encrypt" className="text-lg font-semibold">Step 1: Upload File(s)</Label>
                <Input id="file-encrypt" type="file" onChange={handleFileChange} className="file:text-foreground h-12 text-base" multiple disabled={step1Completed} />
                {step1Completed && <p className="text-base text-muted-foreground pt-2">Selected: {files.length} file(s)</p>}
            </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step2Completed ? 'bg-green-500' : !step1Completed ? 'bg-muted' : 'bg-primary'} ${!step1Completed ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
                  {step2Completed ? <CheckCircle className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
              </div>
            <div className="h-10 w-px bg-border my-1"></div>
          </div>
          <div className={`flex-1 space-y-2 pb-10 transition-opacity ${step1Completed ? 'opacity-100' : 'opacity-60'}`}>
            <Label htmlFor="key-encrypt" className="text-lg font-semibold">Step 2: Set Secret Key</Label>
            <Input id="key-encrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" disabled={!step1Completed} className="h-12 text-base"/>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${!step1Completed || !step2Completed ? 'bg-muted' : 'bg-primary'} ${!step1Completed || !step2Completed ? 'text-muted-foreground' : 'text-primary-foreground'}`}>
              <Download className="w-6 h-6" />
            </div>
          </div>
          <div className={`flex-1 space-y-2 transition-opacity ${step1Completed && step2Completed ? 'opacity-100' : 'opacity-60'}`}>
            <Label className="text-lg font-semibold">Step 3: Encrypt & Download</Label>
            <Button onClick={handleEncrypt} disabled={loading || !step1Completed || !step2Completed} className="w-full h-14 text-lg">
              {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Lock className="mr-2 h-6 w-6" />}
              Encrypt & Download
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
