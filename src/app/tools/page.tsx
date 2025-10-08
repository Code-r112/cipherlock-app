

"use client";

import { EncryptPanel } from '@/components/feature/encrypt-panel';
import { DecryptPanel } from '@/components/feature/decrypt-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Unlock, MonitorSmartphone, ShieldCheck, Download, KeySquare, FileType, History, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AnimatedLockIcon } from '@/components/ui/animated-lock-icon';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, limit, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { analyzeSecurity, SecurityAnalysisInput } from '@/ai/flows/security-audit-flow';
import { motion } from 'framer-motion';

interface ActivityLog {
    id: string;
    action: 'encrypt' | 'decrypt';
    filename: string;
    timestamp: Timestamp;
}

interface SavedKey {
    id: string;
    name: string;
    key: string;
}

interface ActivityLogFromFirestore {
    action: 'encrypt' | 'decrypt';
    filename: string;
    keyHash: string;
    timestamp: Timestamp;
}

export default function ToolsPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0];
  
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [keyCount, setKeyCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [securityScore, setSecurityScore] = useState<number | null>(null);

  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch recent activities
    const activityQuery = query(collection(db, 'users', user.uid, 'activity'), orderBy('timestamp', 'desc'), limit(3));
    const unsubscribeActivity = onSnapshot(activityQuery, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivityLog));
        setRecentActivities(activities);
    });

    // Fetch all activities for count
     const allActivityQuery = query(collection(db, 'users', user.uid, 'activity'));
     const unsubscribeAllActivity = onSnapshot(allActivityQuery, (snapshot) => {
        setActivityCount(snapshot.size);
     });


    // Fetch keys for count
    const keysQuery = query(collection(db, 'users', user.uid, 'keys'));
    const unsubscribeKeys = onSnapshot(keysQuery, (snapshot) => {
        setKeyCount(snapshot.size);
    });

    // Fetch security score
    const fetchSecurityScore = async () => {
        const cachedData = localStorage.getItem('securityScoreData');
        const now = new Date().getTime();

        if (cachedData) {
            const { score, timestamp } = JSON.parse(cachedData);
            const oneHour = 60 * 60 * 1000;
            if (now - timestamp < oneHour) {
                setSecurityScore(score);
                return;
            }
        }

        const activityLogsQuery = query(collection(db, 'users', user.uid, 'activity'));
        const querySnapshot = await getDocs(activityLogsQuery);
        const activitiesFromFirestore = querySnapshot.docs.map(doc => doc.data() as ActivityLogFromFirestore);

        if (activitiesFromFirestore.length > 0) {
            const activities: SecurityAnalysisInput['activityLogs'] = activitiesFromFirestore.map(log => ({
                ...log,
                timestamp: log.timestamp.toDate().toISOString(),
            }));
            try {
                const result = await analyzeSecurity({ activityLogs: activities });
                setSecurityScore(result.overallScore);
                localStorage.setItem('securityScoreData', JSON.stringify({ score: result.overallScore, timestamp: now }));
            } catch (e) {
                console.error("Could not analyze security", e)
                setSecurityScore(null);
            }
        } else {
            setSecurityScore(100);
            localStorage.setItem('securityScoreData', JSON.stringify({ score: 100, timestamp: now }));
        }
    };
    fetchSecurityScore();


    return () => {
        unsubscribeActivity();
        unsubscribeKeys();
        unsubscribeAllActivity();
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <div className="pb-12 sm:pb-16 animate-fade-in-down">
        </div>

        {user && (
            <section className="mb-12 animate-fade-in-up">
                 {firstName && (
                    <div className="flex items-center justify-start gap-2 text-2xl sm:text-3xl text-muted-foreground mb-4">
                        <AnimatedLockIcon />
                        <p>Hello, {firstName}!</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Files Secured</CardTitle>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activityCount}</div>
                            <p className="text-xs text-muted-foreground">Total encryptions & decryptions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Keys in Vault</CardTitle>
                            <KeySquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{keyCount}</div>
                            <p className="text-xs text-muted-foreground">
                                <Link href="/keys" className="hover:underline">Manage your keys</Link>
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{securityScore ?? '...'}</div>
                            <p className="text-xs text-muted-foreground">
                                <Link href="/security-center" className="hover:underline">View recommendations</Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        )}
        
        <div className="w-full max-w-lg mx-auto my-16 sm:my-24 animate-fade-in-up mt-8">
            <Tabs defaultValue="encrypt" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 sm:h-16 gap-2 bg-transparent p-0">
                <TabsTrigger value="encrypt" className="text-lg sm:text-xl h-full rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted">
                  <Lock className="mr-2 h-6 w-6 sm:h-7 sm:w-7" />Encrypt Files
                </TabsTrigger>
                <TabsTrigger value="decrypt" className="text-lg sm:text-xl h-full rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted">
                  <Unlock className="mr-2 h-6 w-6 sm:h-7 sm:w-7" />Decrypt Files
                </TabsTrigger>
            </TabsList>
            <TabsContent value="encrypt" className="mt-6">
                <EncryptPanel onActiveStepChange={setActiveStep} />
            </TabsContent>
            <TabsContent value="decrypt" className="mt-6">
                <DecryptPanel />
            </TabsContent>
            </Tabs>
        </div>

        {user && recentActivities.length > 0 && (
            <section className="mb-16 sm:mb-24 animate-fade-in-up">
                 <h2 className="text-3xl font-bold text-center mb-8">Recent Activity</h2>
                 <Card>
                    <CardContent className="p-6">
                        <ul className="space-y-4">
                            {recentActivities.map(activity => (
                                <li key={activity.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {activity.action === 'encrypt' ? <Lock className="h-5 w-5 text-primary" /> : <Unlock className="h-5 w-5 text-primary" />}
                                        <div>
                                            <p className="font-medium capitalize">{activity.action}ed <span className="font-semibold">{activity.filename}</span></p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{activity.timestamp.toDate().toLocaleDateString()}</p>
                                </li>
                             ))}
                        </ul>
                    </CardContent>
                 </Card>
                 <div className="text-center mt-6">
                    <Button variant="link" asChild>
                        <Link href="/activity">View All Activity &rarr;</Link>
                    </Button>
                 </div>
            </section>
        )}
      </div>
    </div>
  );
}
