

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
        const activityLogsQuery = query(collection(db, 'users', user.uid, 'activity'));
        const querySnapshot = await getDocs(activityLogsQuery);
        const activitiesFromFirestore = querySnapshot.docs.map(doc => doc.data() as ActivityLogFromFirestore);

        if (activitiesFromFirestore.length > 0) {
            const activities: SecurityAnalysisInput['activityLogs'] = activitiesFromFirestore.map(log => ({
                ...log,
                timestamp: log.timestamp.toDate().toISOString(),
            }));
            const result = await analyzeSecurity({ activityLogs: activities });
            setSecurityScore(result.overallScore);
        } else {
            setSecurityScore(100);
        }
    };
    fetchSecurityScore();


    return () => {
        unsubscribeActivity();
        unsubscribeKeys();
        unsubscribeAllActivity();
    }
  }, [user]);


  const TreeNode = ({ id, icon, title, description, children }: { id: string, icon: React.ReactNode, title: string, description: string, children?: React.ReactNode }) => (
      <div className="flex flex-col items-center text-center relative group/treenode">
          <div className="relative z-10">
              <motion.div 
                className="transition-all duration-300 group-hover/treenode:scale-105 group-hover/treenode:shadow-2xl bg-background border-2 p-6 rounded-2xl w-64 h-full flex flex-col items-center"
                animate={{ 
                    borderColor: activeStep === id ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                    boxShadow: activeStep === id ? '0 0 20px hsl(var(--primary) / 0.5)' : 'none',
                }}
                transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 text-primary transition-colors duration-300 group-hover/treenode:text-accent-foreground">{icon}</div>
                  <h3 className="font-bold text-xl mb-2 transition-colors duration-300 group-hover/treenode:text-accent-foreground">{title}</h3>
                  <p className="text-base text-muted-foreground">{description}</p>
              </motion.div>
          </div>
          {children && (
              <>
                  <div className="mt-8 w-px h-8 bg-border"></div>
                  <div className="flex justify-center w-full relative">
                      <div className="absolute top-0 h-px bg-border" style={{ width: `calc(100% - 4rem)` }}></div>
                      {children}
                  </div>
              </>
          )}
      </div>
  );
  
  const TreeContainer = ({ children }: { children: React.ReactNode }) => (
      <div className="flex justify-center">
          {children}
      </div>
  );
  
  const SubTree = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-around w-full gap-8 pt-8">
        {children}
    </div>
  );


  return (
    <div className="flex flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <div className="text-center pt-8 pb-12 sm:pt-12 sm:pb-16 animate-fade-in-down">
          {user && firstName && (
            <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl text-muted-foreground mb-4">
              <AnimatedLockIcon />
              <p>Hello, {firstName}!</p>
            </div>
          )}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider">
            Encryption Tools
          </h1>
          <p className="text-muted-foreground mt-4 text-lg sm:text-2xl">
            Encrypt and decrypt your files with confidence.
          </p>
        </div>

        {user && (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in-up">
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
            </section>
        )}
        
        <div className="w-full max-w-lg mx-auto mb-16 sm:mb-24 animate-fade-in-up">
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

        <section id="how-it-works" className="mb-16 sm:mb-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">How It Works</h2>
                <p className="text-lg sm:text-xl text-muted-foreground mb-12">CipherLock ensures your privacy by performing all encryption and decryption locally on your device. Your files are never uploaded to any server.</p>
            </div>
            <div className="max-w-5xl mx-auto overflow-x-auto p-4">
                <TreeContainer>
                    <TreeNode id="file" title="Your File & Key" description="The process begins with your file and a unique key you provide, all on your local machine." icon={<FileType className="w-10 h-10" />}>
                        <SubTree>
                            <TreeNode id="browser" title="In-Browser Reading" description="File is read into the browser's memory, never leaving your computer." icon={<MonitorSmartphone className="w-10 h-10" />}>
                                <SubTree>
                                    <TreeNode id="encrypt" title="AES-256 Encryption" description="Content is encrypted with your key using a military-grade algorithm." icon={<ShieldCheck className="w-10 h-10" />}>
                                        <SubTree>
                                            <TreeNode id="download" title="Encrypted Download" description="The result is securely packaged and downloaded back to you as a '.ciph' file." icon={<Download className="w-10 h-10" />} />
                                        </SubTree>
                                    </TreeNode>
                                </SubTree>
                            </TreeNode>
                            <TreeNode id="key" title="Key Hashing (Optional)" description="If you're logged in, a hash of the key is stored for security analysis, not the key itself." icon={<KeySquare className="w-10 h-10" />} />
                        </SubTree>
                    </TreeNode>
                </TreeContainer>
            </div>
        </section>

      </div>
    </div>
  );
}
