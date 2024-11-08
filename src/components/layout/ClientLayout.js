'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header/Header';

export function ClientLayout({ children }) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) {
        return children;
    }

    return (
        <>
            <Header />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </>
    );
}
