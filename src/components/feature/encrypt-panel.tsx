
"use client";

import { useState, type ChangeEvent, useEffect, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, KeyRound, Download, CheckCircle, Files, Bot, Sparkles, Copy, Save, Lightbulb, Share2, ClipboardCopy, BrainCircuit } from "lucide-react";
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
import { createShareableFile } from '@/services/share-service';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface SavedKey {
    id: string;
    name: string;
    key: string;
}

interface EncryptedResult {
    filename: string;
    blob: Blob;
    content: string;
}

interface EncryptPanelProps {
    onActiveStepChange: (step: string | null) => void;
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

const SUPPORTED_AI_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'text/plain',
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'application/xml',
  'application/pdf',
  'video/mp4',
  'audio/mpeg',
  'audio/wav',
];


export function EncryptPanel({ onActiveStepChange }: EncryptPanelProps) {
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
  const [encryptedResult, setEncryptedResult] = useState<EncryptedResult | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (key) {
        onActiveStepChange('key');
    } else if (files.length > 0) {
        onActiveStepChange('file');
    } else {
        onActiveStepChange(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, key]);


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
      setEncryptedResult(null);
      setShareLink(null);
      onActiveStepChange('browser');
      const file = files[0];
      const isSupported = SUPPORTED_AI_FILE_TYPES.includes(file.type);
      
      if (!isSupported) {
          setFinalFilename(file.name.replace(/\.[^/.]+$/, ""));
          toast({
              title: "AI Skipped",
              description: `AI analysis doesn't support the file type '${file.type}'. Using original filename.`,
          });
          return;
      }
      
      setLoadingAi(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        try {
          const [filenameResult, summaryResult, keyResult] = await Promise.all([
            suggestFilename({ fileDataUri: dataUrl, originalName: file.name }),
            summarizeFile({ fileDataUri: dataUrl }),
            suggestKey({ fileDataUri: dataUrl, savedKeys: savedKeys }),
          ]);
          
          const newName = filenameResult.suggestedName.replace(/\.[^/.]+$/, "");
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
      setEncryptedResult(null);
      setShareLink(null);
      setFinalFilename(files[0].name.replace(/\.[^/.]+$/, ""));
      onActiveStepChange('browser');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, user, savedKeys, toast]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    onActiveStepChange('file');
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.some(f => f.size > 1024 * 1024) && user) {
           toast({
              variant: "destructive",
              title: "File Too Large for Sharing",
              description: "Files over 1MB cannot be shared. You can still encrypt and download it.",
          });
      }
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

  const handleEncryptAndDownload = () => {
      onActiveStepChange('download');
      handleEncrypt(true);
  }

  const handleEncryptAndShare = () => {
      onActiveStepChange('download');
      handleEncrypt(false);
  }

  const handleCreateShareLink = async () => {
      if (!encryptedResult || !user) return;
      
      setIsSharing(true);
      try {
          const fileId = await createShareableFile({
              encryptedContent: encryptedResult.content,
              creatorId: user.uid
          });
          const link = `${window.location.origin}/share/${fileId}`;
          setShareLink(link);
      } catch (error) {
           toast({
            variant: "destructive",
            title: "Sharing Failed",
            description: "Could not create a shareable link. Please try again.",
          });
      } finally {
          setIsSharing(false);
      }
  }

  const handleCopyShareLink = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link Copied",
      description: "The shareable link has been copied to your clipboard.",
    });
  }

  const handleEncrypt = (shouldDownload: boolean) => {
    if (files.length === 0 || !key) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please select one or more files and enter a secret key.",
      });
      onActiveStepChange(null);
      return;
    }

    onActiveStepChange('encrypt');
    setLoading(true);
    setEncryptedResult(null);
    setShareLink(null);
    
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
          const encryptedFilename = `${filename}.ciph`;

          setEncryptedResult({filename: encryptedFilename, blob, content: encrypted});
          
          if (shouldDownload) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = encryptedFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
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
            if (shouldDownload) {
                toast({
                  title: "Encryption Complete",
                  description: `${files.length} file(s) have been encrypted and downloaded.`,
                });
            } else {
                 toast({
                  title: "Encryption Complete",
                  description: `File encrypted. You can now share it.`,
                });
            }
             setTimeout(() => onActiveStepChange(null), 2000);
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
            onActiveStepChange(null);
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
  
  const canShare = useMemo(() => {
      if (!user || files.length === 0) return false;
      return files[0].size <= 1024 * 1024;
  }, [user, files]);


  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Encrypt File(s)</CardTitle>
        <CardDescription>Select files, set a key, and get encrypted copies. {user && <strong>Logged-in users get AI-powered naming and secure sharing!</strong>}</CardDescription>
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
                <Card className="bg-primary/10 border-primary/20 my-2">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
                        <BrainCircuit className="w-8 h-8 text-primary flex-shrink-0" />
                        <div>
                             <CardTitle className="text-base text-primary">AI Suggestion</CardTitle>
                             <CardDescription className="text-primary/90">
                                Based on the file content, we recommend using your key: <span className="font-semibold">{suggestedKeyName}</span>
                            </CardDescription>
                        </div>
                    </CardHeader>
                </Card>
            )}
            <div className="flex items-center gap-2">
                <Input id="key-encrypt" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your secret key" disabled={!step1Completed} className="h-12 text-base"/>
                {user && <Button variant="outline" size="icon" onClick={handleGenerateKey} disabled={!step1Completed}><Sparkles className="w-5 h-5"/></Button>}
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
          <div className={`flex-1 space-y-4 transition-opacity ${step1Completed && step2Completed && step3Completed ? 'opacity-100' : 'opacity-60'}`}>
            <Label className="text-lg font-semibold">Step 3: Encrypt & Download or Share</Label>
            <div className="flex flex-col sm:flex-row gap-4">
                 <Button onClick={handleEncryptAndDownload} disabled={loading || loadingAi || !step1Completed || !step2Completed || !step3Completed} className="w-full h-14 text-lg rounded-full">
                    {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Lock className="mr-2 h-6 w-6" />}
                    Encrypt & Download
                </Button>
                {user && (
                     <Button onClick={handleEncryptAndShare} disabled={!canShare || loading || loadingAi || !step1Completed || !step2Completed || !step3Completed} className="w-full h-14 text-lg rounded-full" variant="secondary">
                        <Share2 className="mr-2 h-6 w-6" />
                        Encrypt for Sharing
                    </Button>
                )}
            </div>
            {!canShare && user && step1Completed && (
                <p className='text-sm text-muted-foreground'>Sharing is disabled for files larger than 1MB.</p>
            )}
          </div>
        </div>

        {encryptedResult && !shareLink && (
            <div className='space-y-4 pt-6 border-t'>
                <Alert>
                    <Share2 className="h-4 w-4" />
                    <AlertTitle>Ready to Share!</AlertTitle>
                    <AlertDescription>
                        Your file is encrypted and ready. Click the button below to generate a secure, one-time share link.
                    </AlertDescription>
                </Alert>
                <Button onClick={handleCreateShareLink} disabled={isSharing} className="w-full h-12 text-lg">
                    {isSharing ? <Loader2 className="mr-2 h-5 w-5 animate-spin"/> : <Share2 className="mr-2 h-5 w-5" />}
                    Generate Secure Link
                </Button>
            </div>
        )}

        {shareLink && (
             <div className='space-y-4 pt-6 border-t'>
                 <Alert variant="default" className="bg-primary/10 border-primary/20">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary">Share Link Generated!</AlertTitle>
                    <AlertDescription>
                        Copy the link below and send it to your recipient. <strong>Remember to share the decryption key separately and securely!</strong> This link will be invalid after the first download.
                    </AlertDescription>
                </Alert>
                <div className="flex items-center gap-2">
                    <Input readOnly value={shareLink} className="h-12 text-base"/>
                    <Button size="icon" onClick={handleCopyShareLink}>
                        <ClipboardCopy className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        )}


      </CardContent>
    </Card>
  );
}
