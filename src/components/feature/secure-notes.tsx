"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { PlusCircle, Edit, Trash2, Lock, Unlock, Save, XCircle, Loader2 } from "lucide-react";
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

interface Note {
  id: string;
  title: string;
  encryptedContent: string;
  createdAt: string;
}

export function SecureNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [key, setKey] = useState('');
  const [currentNote, setCurrentNote] = useState<Partial<Note> & { content?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState('');
  const [decryptionKey, setDecryptionKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedNotes = localStorage.getItem('secure-notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (e) {
      toast({ variant: 'destructive', title: 'Could not load notes.' });
    }
  }, [toast]);

  const saveNotesToStorage = useCallback((notesToSave: Note[]) => {
    try {
      localStorage.setItem('secure-notes', JSON.stringify(notesToSave));
    } catch (e) {
      toast({ variant: 'destructive', title: 'Could not save notes.' });
    }
  }, [toast]);

  const handleSaveNote = () => {
    if (!currentNote?.title || !currentNote?.content || !key) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please provide a title, content, and a secret key." });
      return;
    }

    const encryptedContent = CryptoJS.AES.encrypt(currentNote.content, key).toString();
    
    let updatedNotes: Note[];
    if (isEditing && currentNote.id) {
        updatedNotes = notes.map(n => n.id === currentNote.id ? { ...n, title: currentNote.title!, encryptedContent } : n);
    } else {
        const newNote: Note = {
            id: uuidv4(),
            title: currentNote.title,
            encryptedContent,
            createdAt: new Date().toISOString(),
        };
        updatedNotes = [...notes, newNote];
    }
    
    setNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
    toast({ title: isEditing ? "Note Updated" : "Note Saved", description: "Your secure note has been saved." });
    resetForm();
  };

  const resetForm = () => {
    setCurrentNote(null);
    setKey('');
    setIsEditing(false);
    const closeButton = document.getElementById('dialog-close');
    if(closeButton) closeButton.click();
  };
  
  const handleDecryptNote = () => {
      if(!currentNote || !decryptionKey) {
          toast({ variant: 'destructive', title: 'Missing key', description: 'Please enter the secret key.' });
          return;
      }
      try {
        const bytes = CryptoJS.AES.decrypt(currentNote.encryptedContent!, decryptionKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if(!decrypted) {
            throw new Error("Wrong key");
        }
        setDecryptedContent(decrypted);
      } catch (e) {
        toast({ variant: 'destructive', title: 'Decryption Failed', description: 'Wrong key or corrupted note.'});
        setDecryptedContent('');
      }
  }

  if (!isMounted) return null;

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Secure Notes</CardTitle>
          <CardDescription>Create, view, and manage end-to-end encrypted notes.</CardDescription>
        </div>
        <Dialog onOpenChange={(open) => !open && resetForm()}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-5 w-5" />
              New Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit' : 'Create'} Secure Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Title</Label>
                <Input id="note-title" placeholder="Note title" value={currentNote?.title || ''} onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-content">Content</Label>
                <Textarea id="note-content" placeholder="Your secret content..." value={currentNote?.content || ''} onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-key">Secret Key</Label>
                <Input id="note-key" type="password" placeholder="Your secret key" value={key} onChange={(e) => setKey(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline" id="dialog-close">Cancel</Button></DialogClose>
              <Button onClick={handleSaveNote}><Save className="mr-2 h-4 w-4" /> Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog onOpenChange={(open) => {
                      if (!open) {
                        setDecryptedContent('');
                        setDecryptionKey('');
                      }
                      setCurrentNote(note);
                  }}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Unlock className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Decrypt Note: {note.title}</DialogTitle></DialogHeader>
                        {decryptedContent ? (
                            <div className="space-y-4">
                               <Label>Decrypted Content</Label>
                               <Textarea readOnly value={decryptedContent} rows={6} className="bg-muted"/>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Label htmlFor="decrypt-key">Secret Key</Label>
                                <Input id="decrypt-key" type="password" value={decryptionKey} onChange={e => setDecryptionKey(e.target.value)} placeholder="Enter key to decrypt"/>
                            </div>
                        )}
                        <DialogFooter>
                            <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
                             {!decryptedContent && <Button onClick={handleDecryptNote}><Unlock className="mr-2 h-4 w-4"/>Decrypt</Button>}
                        </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog onOpenChange={(open) => {
                      if (open) {
                        setIsEditing(true);
                        setCurrentNote({ ...note, content: '' }); // Clear content for security
                      } else {
                        resetForm();
                      }
                  }}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Edit Secure Note</DialogTitle></DialogHeader>
                        <p className="text-sm text-muted-foreground">You are editing "{note.title}". Please provide the new content and the original secret key to re-encrypt.</p>
                        <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-note-title">Title</Label>
                            <Input id="edit-note-title" placeholder="Note title" value={currentNote?.title || ''} onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-note-content">New Content</Label>
                            <Textarea id="edit-note-content" placeholder="Your new secret content..." value={currentNote?.content || ''} onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-note-key">Secret Key</Label>
                            <Input id="edit-note-key" type="password" placeholder="Enter secret key to save" value={key} onChange={(e) => setKey(e.target.value)} />
                        </div>
                        </div>
                        <DialogFooter>
                           <DialogClose asChild><Button variant="outline" id="dialog-close">Cancel</Button></DialogClose>
                           <Button onClick={handleSaveNote}><Save className="mr-2 h-4 w-4" /> Update</Button>
                        </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => {
                      if(window.confirm(`Are you sure you want to delete "${note.title}"?`)){
                          const updatedNotes = notes.filter(n => n.id !== note.id);
                          setNotes(updatedNotes);
                          saveNotesToStorage(updatedNotes);
                          toast({ title: 'Note Deleted' });
                      }
                  }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Secure Notes Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Get started by creating a new secure note.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
