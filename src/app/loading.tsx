
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-24 w-24 animate-spin text-primary" />
    </div>
  );
}
