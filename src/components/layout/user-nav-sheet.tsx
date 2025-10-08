
'use client';

import {
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, onSnapshot, query, Timestamp } from "firebase/firestore";
import { User, UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { History, KeyRound, ShieldAlert, Settings, LogOut, LayoutDashboard, Fingerprint } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { analyzeSecurity, SecurityAnalysisInput } from "@/ai/flows/security-audit-flow";

interface UserNavSheetProps {
    user: User;
}

interface ActivityLogFromFirestore {
    action: 'encrypt' | 'decrypt';
    filename: string;
    keyHash: string;
    timestamp: Timestamp;
}


export function UserNavSheet({ user }: UserNavSheetProps) {
    const { signOut } = useAuth();
    const [keyCount, setKeyCount] = useState(0);
    const [securityScore, setSecurityScore] = useState<number | null>(null);

    useEffect(() => {
        if (!user) return;

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
                    setSecurityScore(null);
                }
            } else {
                setSecurityScore(100);
                 localStorage.setItem('securityScoreData', JSON.stringify({ score: 100, timestamp: now }));
            }
        };

        fetchSecurityScore();

        return () => {
            unsubscribeKeys();
        };
    }, [user]);

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-muted-foreground';
        if (score < 50) return 'text-red-500';
        if (score < 80) return 'text-yellow-500';
        return 'text-green-500';
    }


    const navItems = [
        { href: "/tools", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
        { href: "/activity", icon: <History className="h-5 w-5" />, label: "Activity Log" },
        { href: "/keys", icon: <KeyRound className="h-5 w-5" />, label: "Key Vault" },
        { href: "/security-center", icon: <ShieldAlert className="h-5 w-5" />, label: "Security Center" },
        { href: "/settings", icon: <Settings className="h-5 w-5" />, label: "Settings" },
    ];


    return (
        <div className="flex flex-col h-full">
            <SheetHeader className="p-6 text-left">
                <SheetTitle className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>
                            <UserIcon className="h-8 w-8"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-xl font-semibold">{user.displayName}</span>
                        <span className="text-base text-muted-foreground font-normal">{user.email}</span>
                    </div>
                </SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-4 px-6 py-4">
                <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Security Score</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                         <p className={`text-3xl font-bold ${getScoreColor(securityScore)}`}>{securityScore ?? 'N/A'}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Keys in Vault</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                         <p className="text-3xl font-bold">{keyCount}</p>
                    </CardContent>
                </Card>
            </div>
            <Separator />
            <nav className="flex-grow p-4">
                <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.href}>
                             <Button asChild variant="ghost" className="w-full justify-start h-12 text-base">
                                <Link href={item.href}>
                                    {item.icon}
                                    <span className="ml-4">{item.label}</span>
                                </Link>
                             </Button>
                        </li>
                    ))}
                </ul>
            </nav>
            <Separator />
            <div className="p-4 flex justify-between items-center">
                <ThemeToggle/>
                <Button variant="outline" onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    )
}
