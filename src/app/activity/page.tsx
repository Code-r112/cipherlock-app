
"use client";

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Unlock, History, Loader2, FileText } from 'lucide-react';

interface ActivityLog {
    id: string;
    action: 'encrypt' | 'decrypt';
    filename: string;
    timestamp: Timestamp;
    summary?: string;
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
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">Activity Log</h1>
                    <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">A record of your recent encryption and decryption actions.</p>
                </header>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-xl sm:text-2xl"><History className="mr-2"/>Your Recent Activity</CardTitle>
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
                                    <li key={activity.id} className="flex flex-col sm:flex-row items-start justify-between p-4 bg-secondary rounded-lg gap-4">
                                        <div className="flex items-start flex-1">
                                            {activity.action === 'encrypt' ? <Lock className="h-6 w-6 mr-4 text-primary flex-shrink-0 mt-1" /> : <Unlock className="h-6 w-6 mr-4 text-primary flex-shrink-0 mt-1" />}
                                            <div className="flex-1">
                                                <p className="font-semibold text-base sm:text-lg capitalize">{activity.action}ed File</p>
                                                <p className="text-sm sm:text-base text-muted-foreground break-all">{activity.filename}</p>
                                                {activity.summary && (
                                                    <div className="flex items-start text-xs sm:text-sm text-muted-foreground mt-2 bg-background/50 p-2 rounded-md">
                                                        <FileText className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5"/>
                                                        <p><span className="font-semibold">AI Summary:</span> {activity.summary}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs sm:text-sm text-muted-foreground text-left sm:text-right w-full sm:w-auto flex-shrink-0 mt-2 sm:mt-0">
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
