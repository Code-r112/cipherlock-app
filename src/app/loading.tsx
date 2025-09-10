import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-pulse">
        <div className="flex items-center space-x-4">
            <ShieldCheck className="h-16 w-16 text-primary" />
            <h1 className="text-5xl font-bold">CipherLock</h1>
        </div>
        <p className="mt-4 text-lg text-muted-foreground">Securing your session...</p>
    </div>
  );
}
