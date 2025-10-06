"use client";

import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/layout/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </AuthProvider>
    );
}
