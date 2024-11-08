"use client";
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { account, appwriteService } from '@/lib/appwrite/client';
import { ID } from 'appwrite';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    // Check if user is logged in
    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            const session = await account.get();
            if (session) {
                const profile = await appwriteService.getUserProfile(session.$id);
                setUser({ ...session, ...profile });
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Register new user
    const register = async (email, password, name) => {
        try {
            setError(null);
            // Create account
            const response = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // Create user profile
            await appwriteService.createUserProfile(response.$id, {
                name,
                email,
                createdAt: new Date().toISOString(),
            });

            // Log in the user after registration
            await login(email, password);
            
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Login user
    const login = async (email, password) => {
        try {
            setError(null);
            const session = await account.createEmailPasswordSession(email, password);
            await checkAuth();
            return session;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/auth/login');
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            setError(null);
            if (!user?.$id) throw new Error('User not found');

            const updatedProfile = await appwriteService.updateUserProfile(
                user.$id,
                userData
            );
            setUser(prev => ({ ...prev, ...updatedProfile }));
            return updatedProfile;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    // Check auth status on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user
    };
};

// Route protection hook
export const useAuthProtection = (requireAuth = true) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (requireAuth && !isAuthenticated) {
                router.push('/auth/login');
            } else if (!requireAuth && isAuthenticated) {
                router.push('/');
            }
        }
    }, [isAuthenticated, loading, requireAuth, router]);

    return { loading };
};
