
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
    // This feature is disabled for now.
    throw new Error("Sharing is not enabled.");
}


const GetSharedFileSchema = z.object({
    fileId: z.string(),
});
export type GetSharedFile = z.infer<typeof GetSharedFileSchema>;

export async function getSharedFile(input: GetSharedFile): Promise<{ encryptedContent: string } | null> {
    // This feature is disabled for now.
    return null;
}

    