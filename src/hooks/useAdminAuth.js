'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { authService } from '@/lib/appwrite/services/auth.service';

export const useAdminAuth = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!loading) {
                if (!user) {
                    router.push('/admin/login');
                    return;
                }

                const isAdmin = await authService.isAdmin(user.$id);
                if (!isAdmin) {
                    router.push('/');
                }
            }
        };

        checkAdminStatus();
    }, [user, loading, router]);

    return { user, loading };
};
