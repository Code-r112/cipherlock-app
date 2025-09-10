
"use client";

import { useState, type ChangeEvent, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, KeyRound, Download, CheckCircle, Files, Bot, Sparkles, Copy, Save, Lightbulb } from "lucide-react";
import CryptoJS from 'crypto-js';
import { useAuth } from '@/hooks/use-auth';
import { suggestFilename } from '@/ai/flows/suggest-filename-flow';
import { summarizeFile } from '@/ai/flows/summarize-file-flow';
import { suggestKey } from '@/ai/flows/suggest-key-flow';
import { Progress } from '@/components/ui/progress';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query } from 'firebase/firestore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SavedKey {
    id: string;
    name: string;
    key: string;
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

export function EncryptPanel() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [finalFilename, setFinalFilename] = useState('');
  const [summary, setSummary] = useState('');
  const [suggestedKeyId, setSuggestedKeyId] = useState('');
  const [savedKeys, setSavedKeys] = useState<SavedKey[]>([]);
  const [keyName, setKeyName] = useState('');
  const [isSaveKeyDialogOpen, setSaveKeyDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
        const fetchKeys = async () => {
            const keysQuery = query(collection(db, 'users', user.uid, 'keys'));
            const querySnapshot = await getDocs(keysQuery);
            const keys = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedKey));
            setSavedKeys(keys);
        };
        fetchKeys();
    }
  }, [user]);

  useEffect(() => {
    if (files.length > 0 && user) {
      setLoadingAi(true);
      const file = files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        try {
          // Run AI suggestions in parallel
          const [filenameResult, summaryResult, keyResult] = await Promise.all([
            suggestFilename({ fileDataUri: dataUrl, originalName: file.name }),
            summarizeFile({ fileDataUri: dataUrl }),
            suggestKey({ fileDataUri: dataUrl, savedKeys: savedKeys }),
          ]);
          
          const newName = filenameResult.suggestedName.replace(/\.[^/.]+$/, ""); // Remove extension
          setFinalFilename(newName);
          setSummary(summaryResult.summary);
          if (keyResult.suggestedKeyId) {
              setSuggestedKeyId(keyResult.suggestedKeyId);
              const suggested = savedKeys.find(k => k.id === keyResult.suggestedKeyId);
              if (suggested) {
                  setKey(suggested.key);
              }
          }

        } catch (error) {
          console.error("AI features failed:", error);
          toast({ variant: 'destructive', title: 'AI Features Failed', description: 'Could not generate AI suggestions.' });
          setFinalFilename(file.name.replace(/\.[^/.]+$/, ""));
        } finally {
          setLoadingAi(false);
        }
      };
      reader.readAsDataURL(file);
    } else if (files.length > 0) {
      setFinalFilename(files[0].name.replace(/\.[^/.]+$/, ""));
    }
  }, [files, user, savedKeys, toast]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(user ? selectedFiles.slice(0, 1) : selectedFiles);
      if (user && selectedFiles.length > 1) {
          toast({
              variant: "destructive",
              title: "Feature Limit",
              description: "With AI features enabled, you can only encrypt one file at a time.",
          });
      }
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
  
  const handleSaveKey = async () => {
      if (!key || !keyName) {
          toast({ variant: "destructive", title: "Missing Information", description: "Please provide a name for the key." });
          return;
      }
      if (user) {
          await addDoc(collection(db, 'users', user.uid, 'keys'), { name: keyName, key });
          toast({ title: "Key Saved", description: `The key "${keyName}" has been saved.` });
          setKeyName('');
          setSaveKeyDialogOpen(false);
          // Refetch keys
          const keysQuery = query(collection(db, 'users', user.uid, 'keys'));
          const querySnapshot = await getDocs(keysQuery);
          const keys = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedKey));
          setSavedKeys(keys);
      }
  };

  const logActivity = async (filename: string, keyUsed: string, fileSummary?: string) => {
      if (user) {
          const keyHash = CryptoJS.SHA256(keyUsed).toString();
          try {
              await addDoc(collection(db, 'users', user.uid, 'activity'), {
                  action: 'encrypt',
                  filename: filename,
                  keyHash: keyHash,
                  timestamp: serverTimestamp(),
                  summary: fileSummary || '',
              });
          } catch (error) {
              console.error("Error logging activity: ", error);
          }
      }
  }

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
      
      const filename = (files.length === 1 && finalFilename) ? finalFilename : file.name.replace(/\.[^/.]+$/, "");

      reader.onload = (e) => {
        try {
          const dataUrl = e.target?.result as string;
          const contentHash = CryptoJS.SHA256(dataUrl).toString();

          const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ data: dataUrl, name: file.name, hash: contentHash }), key).toString();

          const blob = new Blob([encrypted], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const encryptedFilename = `${filename}.ciph`;
          a.download = encryptedFilename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          logActivity(encryptedFilename, key, summary);

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
  const step3Completed = user ? finalFilename.length > 0 : true;
  const keyStrength = checkKeyStrength(key);
  const suggestedKeyName = useMemo(() => {
      if (!suggestedKeyId) return null;
      return savedKeys.find(k => k.id === suggestedKeyId)?.name;
  }, [suggestedKeyId, savedKeys]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Encrypt File(s)</CardTitle>
        <CardDescription>Select files, set a key, and get encrypted copies. {user && <strong>Logged-in users get AI-powered naming and key saving!</strong>}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">

        <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step1Completed ? 'bg-primary/80' : 'bg-primary'} text-primary-foreground transition-all`}>
                {step1Completed ? <CheckCircle className="w-6 h-6" /> : <Files className="w-6 h-6" />}
                </div>
                <div className={`h-10 w-px bg-border my-1 transition-all duration-300 ${step1Completed ? 'h-16' : 'h-10'}`}></div>
            </div>
            <div className="flex-1 space-y-2 pb-10">
                <Label htmlFor="file-encrypt" className="text-lg font-semibold">Step 1: Upload File(s)</Label>
                <Input id="file-encrypt" type="file" onChange={handleFileChange} className="file:text-foreground h-12 text-base" multiple={!user} disabled={step1Completed} />
                {step1Completed && <p className="text-base text-muted-foreground pt-2">Selected: {files.length} file(s)</p>}
            </div>
        </div>
        
        {user && step1Completed && (
          <div className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground transition-all`}>
                   <Bot className="w-6 h-6" />
                </div>
                <div className="h-10 w-px bg-border my-1"></div>
            </div>
            <div className="flex-1 space-y-2 pb-10">
                <Label htmlFor="ai-name" className="text-lg font-semibold flex items-center">AI Suggested Filename</Label>
                {loadingAi ? (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating AI suggestions...</span>
                    </div>
                ) : (
                    <Input id="ai-name" value={finalFilename} onChange={(e) => setFinalFilename(e.target.value)} placeholder="AI Suggested name" className="h-12 text-base" />
                )}
                 <p className="text-xs text-muted-foreground">Our AI suggests a name for your encrypted file. You can edit it.</p>
            </div>
          </div>
        )}

        <div className="flex items-start space-x-4">
          <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step2Completed ? 'bg-primary/80' : !step1Completed ? 'bg-muted' : 'bg-primary'} ${!step1Completed ? 'text-muted-foreground' : 'text-primary-foreground'} transition-all`}>
                  {step2Completed ? <CheckCircle className="w-6 h-6" /> : <KeyRound className="w-6 h-6" />}
              </div>
            <div className={`h-10 w-px bg-border my-1 transition-all duration-300 ${step2Completed ? 'h-24' : 'h-10'}`}></div>
          </div>
          <div className={`flex-1 space-y-2 pb-10 transition-opacity ${step1Completed ? 'opacity-100' : 'opacity-60'}`}>
            <Label htmlFor="key-encrypt" className="text-lg font-semibold">Step 2: Set Secret Key</Label>
            {user && savedKeys.length > 0 && (
                <Select onValueChange={(value) => setKey(value)} value={key}>
                    <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Or select a saved key" />
                    </SelectTrigger>
                    <SelectContent>
                        {savedKeys.map(savedKey => (
                            <SelectItem key={savedKey.id} value={savedKey.key}>{savedKey.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
            {suggestedKeyName && !loadingAi && (
                <div className="flex items-center gap-2 p-2 bg-primary/10 text-primary-foreground rounded-md text-sm">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-primary">AI Suggestion: Use key <span className="font-bold">{suggestedKeyName}</span> for this file.</p>
                </div>
            )}
            <div className="flex items-center gap-2">
                <Input id="key-encrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" disabled={!step1Completed} className="h-12 text-base"/>
                <Button variant="outline" size="icon" onClick={handleGenerateKey} disabled={!step1Completed}><Sparkles className="w-5 h-5"/></Button>
                <Button variant="outline" size="icon" onClick={handleCopyKey} disabled={!key}><Copy className="w-5 h-5"/></Button>
                {user && (
                  <Dialog open={isSaveKeyDialogOpen} onOpenChange={setSaveKeyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" disabled={!key}><Save className="w-5 h-5"/></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Secret Key</DialogTitle>
                        <DialogDescription>Give this key a recognizable name to save it for later use.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2">
                        <Label htmlFor="key-name">Key Name</Label>
                        <Input id="key-name" value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="e.g., 'Work Documents Key'"/>
                      </div>
                      <DialogFooter>
                        <Button variant="secondary" onClick={() => setSaveKeyDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveKey}>Save Key</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
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
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${!step1Completed || !step2Completed || !step3Completed ? 'bg-muted' : 'bg-primary'} ${!step1Completed || !step2Completed || !step3Completed ? 'text-muted-foreground' : 'text-primary-foreground'} transition-all`}>
              <Download className="w-6 h-6" />
            </div>
          </div>
          <div className={`flex-1 space-y-2 transition-opacity ${step1Completed && step2Completed && step3Completed ? 'opacity-100' : 'opacity-60'}`}>
            <Label className="text-lg font-semibold">Step 3: Encrypt & Download</Label>
            <Button onClick={handleEncrypt} disabled={loading || loadingAi || !step1Completed || !step2Completed || !step3Completed} className="w-full h-14 text-lg rounded-full">
              {loading || loadingAi ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Lock className="mr-2 h-6 w-6" />}
              Encrypt & Download
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
