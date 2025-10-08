
"use client";

import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { analyzeSecurity, type SecurityAnalysisInput, type SecurityAnalysisOutput } from '@/ai/flows/security-audit-flow';
import { Breadcrumb } from '@/components/ui/breadcrumb';

interface ActivityLogFromFirestore {
    action: 'encrypt' | 'decrypt';
    filename: string;
    keyHash: string;
    timestamp: Timestamp;
}

export default function SecurityCenterPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [analysis, setAnalysis] = useState<SecurityAnalysisOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/auth');
            return;
        }
        
        handleAnalyzeSecurity();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, router]);

    const handleAnalyzeSecurity = async () => {
        if (!user) return;
        
        setLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            // 1. Fetch activity data from Firestore
            const activityQuery = query(collection(db, 'users', user.uid, 'activity'));
            const querySnapshot = await getDocs(activityQuery);
            const activitiesFromFirestore = querySnapshot.docs.map(doc => doc.data() as ActivityLogFromFirestore);

            if (activitiesFromFirestore.length === 0) {
                setAnalysis({
                    overallScore: 100,
                    recommendations: [{
                        title: "No Activity Yet",
                        description: "We can't analyze your security without any activity. Start encrypting and decrypting files to get your first security report!",
                        severity: 'info'
                    }]
                });
                setLoading(false);
                return;
            }

            // Convert Timestamps to serializable strings
            const activities: SecurityAnalysisInput['activityLogs'] = activitiesFromFirestore.map(log => ({
                ...log,
                timestamp: log.timestamp.toDate().toISOString(),
            }));

            // 2. Call the Genkit flow
            const result = await analyzeSecurity({ activityLogs: activities });
            setAnalysis(result);

        } catch (err) {
            console.error("Security analysis failed:", err);
            setError("We couldn't complete the security analysis. Please try again later.");
        } finally {
            setLoading(false);
        }
    }


    const getSeverityIcon = (severity: 'low' | 'medium' | 'high' | 'info') => {
        switch (severity) {
            case 'high': return <AlertTriangle className="h-6 w-6 text-red-500 mr-4 flex-shrink-0" />;
            case 'medium': return <AlertTriangle className="h-6 w-6 text-yellow-500 mr-4 flex-shrink-0" />;
            case 'low': return <Info className="h-6 w-6 text-blue-500 mr-4 flex-shrink-0" />;
            case 'info': return <Info className="h-6 w-6 text-muted-foreground mr-4 flex-shrink-0" />;
            default: return <ShieldCheck className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />;
        }
    }
    
    const getScoreColor = (score: number) => {
        if (score < 50) return 'text-red-500';
        if (score < 80) return 'text-yellow-500';
        return 'text-green-500';
    }

    return (
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Breadcrumb />
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">Security Center</h1>
                    <p className="mt-4 text-xl sm:text-2xl text-muted-foreground">Your AI-powered security analysis and recommendations.</p>
                </header>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl">Overall Security Score</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                             {loading ? (
                                <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                             ) : analysis && (
                                <p className={`text-7xl sm:text-8xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                                    {analysis.overallScore}
                                </p>
                             )}
                        </CardContent>
                     </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl">Actions</CardTitle>
                            <CardDescription>Re-run the analysis or manage your security settings.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={handleAnalyzeSecurity} disabled={loading} className="w-full h-12 text-lg">
                                {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <ShieldCheck className="mr-2 h-6 w-6" />}
                                Re-Analyze Now
                            </Button>
                        </CardContent>
                     </Card>
                 </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl">AI Recommendations</CardTitle>
                        <CardDescription>Based on your recent activity, here are some suggestions to improve your security posture.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                             <div className="flex items-center justify-center min-h-48">
                                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                            </div>
                        ): error ? (
                            <div className="text-center py-12 text-destructive">
                                <p className="text-xl">{error}</p>
                            </div>
                        ) : analysis && analysis.recommendations.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <ShieldCheck className="h-16 w-16 mx-auto text-green-500 mb-4"/>
                                <p className="text-xl font-semibold">Excellent!</p>
                                <p>We didn't find any immediate security recommendations. Keep up the great work!</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {analysis?.recommendations.map((rec, index) => (
                                    <li key={index} className="flex items-start p-4 bg-secondary rounded-lg">
                                        {getSeverityIcon(rec.severity)}
                                        <div>
                                            <p className="font-semibold text-lg">{rec.title}</p>
                                            <p className="text-muted-foreground">{rec.description}</p>
                                        </div>
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
