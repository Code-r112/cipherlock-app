
"use client";

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Unlock, History, Loader2 } from 'lucide-react';

interface ActivityLog {
    id: string;
    action: 'encrypt' | 'decrypt';
    filename: string;
    timestamp: Timestamp;
}

export default function ActivityPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/auth');
            return;
        }

        const q = query(collection(db, 'users', user.uid, 'activity'), orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userActivities: ActivityLog[] = [];
            querySnapshot.forEach((doc) => {
                userActivities.push({ id: doc.id, ...doc.data() } as ActivityLog);
            });
            setActivities(userActivities);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-7xl font-bold tracking-tight">Activity Log</h1>
                    <p className="mt-4 text-2xl text-muted-foreground">A record of your recent encryption and decryption actions.</p>
                </header>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><History className="mr-2"/>Your Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activities.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-xl">No activity yet.</p>
                                <p>Encrypt or decrypt some files to see your log!</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {activities.map(activity => (
                                    <li key={activity.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                                        <div className="flex items-center">
                                            {activity.action === 'encrypt' ? <Lock className="h-6 w-6 mr-4 text-primary" /> : <Unlock className="h-6 w-6 mr-4 text-primary" />}
                                            <div>
                                                <p className="font-semibold text-lg capitalize">{activity.action}ed File</p>
                                                <p className="text-muted-foreground break-all">{activity.filename}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground text-right">
                                            {activity.timestamp.toDate().toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
