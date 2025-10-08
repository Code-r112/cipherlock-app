
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export function Breadcrumb() {
    const pathname = usePathname();
    const { user } = useAuth();
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0) {
        return null;
    }

    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        const name = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return { name, href, isLast };
    });

    const homeHref = user ? '/tools' : '/';

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                    <Link href={homeHref} className="flex items-center gap-1 hover:text-foreground">
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Link>
                </li>
                {breadcrumbs.map((breadcrumb, index) => (
                    <React.Fragment key={breadcrumb.href}>
                        <li>
                            <ChevronRight className="h-4 w-4" />
                        </li>
                        <li>
                            {breadcrumb.isLast ? (
                                <span className="font-medium text-foreground">
                                    {breadcrumb.name}
                                </span>
                            ) : (
                                <Link href={breadcrumb.href} className="hover:text-foreground">
                                    {breadcrumb.name}
                                </Link>
                            )}
                        </li>
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
}
