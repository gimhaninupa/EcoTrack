import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '../services/userService';
import { authService } from '../services/authService';

interface User {
    uid: string;
    name: string;
    email: string;
    role: 'resident' | 'admin';
    location?: string;
    phone?: string;
    department?: string;
    createdAt?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: typeof authService.loginUser;
    logout: typeof authService.logoutUser;
    register: typeof authService.registerUser;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('AuthContext: Initializing...', { loading, user });

    useEffect(() => {
        console.log('AuthContext: Setting up observer...');
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log('AuthContext: Auth State Changed', firebaseUser?.uid);

            // If firebaseUser is null, user is logged out
            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            // Optimization: If we already have the user loaded and UID matches, 
            // don't re-fetch from Firestore unless necessary.
            // However, on page reload 'user' state is null, so we need to fetch.
            // We can rely on the fact that if 'user' is null, we need to fetch.
            // If 'user' exists and uid matches, we might skip, BUT firebaseUser might have updates.
            // A safe compromise: Always fetch on meaningful auth change or init.

            // To prevent infinite loops with updateProfile:
            // updateProfile in this context updates local state manually.
            // If onAuthStateChanged fires due to token refresh, we might want to skip full re-fetch
            // if we are confident data is fresh. 
            // For now, let's just ensure we handle errors gracefully.

            try {
                let userProfile = await userService.getUserProfile(firebaseUser.uid);

                if (!userProfile) {
                    console.log('AuthContext: User profile not found, creating default profile...');
                    const newProfile: User = {
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: 'resident',
                        createdAt: new Date().toISOString()
                    } as User;

                    try {
                        await userService.createUserProfile(firebaseUser.uid, newProfile);
                        console.log('AuthContext: Default profile created in Firestore');
                    } catch (createError) {
                        console.error('AuthContext: Failed to save default profile to Firestore', createError);
                    }
                    userProfile = newProfile;
                }

                setUser(userProfile as User);
            } catch (error) {
                console.error('Error fetching/creating user profile:', error);
                setUser({
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || 'User',
                    email: firebaseUser.email || '',
                    role: 'resident'
                } as User);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Helper functions are now directly imported from authService in the context value
    // but we can wrap them if needed, or just expose them directly.
    // Exposing directly via authService for cleaner API in components.

    const updateProfile = async (data: Partial<User>) => {
        console.log("AuthContext: updateProfile called for", user?.uid, data);
        if (!user || !auth.currentUser) {
            console.error("AuthContext: No user available to update");
            throw new Error("No user logged in");
        }

        try {
            console.log("AuthContext: Updating in Firestore...");
            // 1. Update Firestore
            await userService.updateUserProfile(user.uid, data);

            // 2. Update Local State directly to prevent unnecessary re-fetches
            setUser(prev => prev ? { ...prev, ...data } : null);

            console.log("AuthContext: Profile updated successfully");
        } catch (error) {
            console.error("AuthContext: Failed to update profile:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logoutUser();
            setUser(null);
        } catch (error) {
            console.error("AuthContext: Logout failed", error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        login: authService.loginUser,
        logout,
        register: authService.registerUser,
        updateProfile
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
