
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc, deleteDoc } from 'firebase/firestore';
import { z } from 'zod';

const CreateShareableFileSchema = z.object({
  encryptedContent: z.string(),
  creatorId: z.string(),
});
export type CreateShareableFile = z.infer<typeof CreateShareableFileSchema>;


export async function createShareableFile(input: CreateShareableFile): Promise<string> {
    const docRef = await addDoc(collection(db, 'sharedFiles'), {
        ...input,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}


const GetSharedFileSchema = z.object({
    fileId: z.string(),
});
export type GetSharedFile = z.infer<typeof GetSharedFileSchema>;

export async function getSharedFile(input: GetSharedFile): Promise<{ encryptedContent: string } | null> {
    const docRef = doc(db, 'sharedFiles', input.fileId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        // For security, delete the file after it has been retrieved once.
        await deleteDoc(docRef);
        return {
            encryptedContent: data.encryptedContent,
        };
    } else {
        return null;
    }
}
