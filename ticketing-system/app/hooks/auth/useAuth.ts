"use client";

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/getuser/getUser';
import { login } from "@/app/(auth)/login/actions/login";
import { registerUser } from '@/app/(auth)/register/actions/register';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    status: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; redirectTo?: string }>;
    logout: () => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const refreshUser = useCallback(async (): Promise<User | null> => {
        try {
            const result = await getCurrentUser();
            if (result.success && result.user) {
                setUser(result.user as User);
                return result.user as User;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            setUser(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, []);

    const loginHandler = async (email: string, password: string) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        
        const result = await login(formData);
        
        if (result.success) {
            // Fetch user and set state BEFORE returning to the caller.
            // The caller (login page) is responsible for navigation AFTER this resolves.
            // This guarantees setUser fires and commits before any router.push.
            const fetchedUser = await refreshUser();
            
            if (fetchedUser) {
                setUser(fetchedUser); // explicit set to ensure it's committed
            }

            return { success: true, redirectTo: result.redirectTo };
        }
        return { success: false, error: result.message || 'Login failed' };
    };

    const registerHandler = async (username: string, email: string, password: string) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        
        const result = await registerUser(formData);
        
        if (result.success) {
            return { success: true, message: result.message };
        }
        
        let errorMessage = 'Registration failed';
        if (result.message) {
            errorMessage = result.message;
        } else if (result.errors) {
            const firstError = Object.values(result.errors).find(arr => arr && arr.length > 0);
            if (firstError && firstError[0]) {
                errorMessage = firstError[0];
            }
        }
        
        return { success: false, error: errorMessage };
    };

    const logoutHandler = async () => {
        setUser(null);
        router.push('/');
    };

    const value = useMemo(() => ({
        user,
        isLoading,
        isAuthenticated: !!user,
        login: loginHandler,
        logout: logoutHandler,
        register: registerHandler,
        refreshUser: async () => { await refreshUser(); },
    }), [user, isLoading]);

    return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}