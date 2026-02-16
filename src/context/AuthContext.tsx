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
            console.log('AuthContext: Auth State Changed', firebaseUser);
            if (firebaseUser) {
                try {
                    let userProfile = await userService.getUserProfile(firebaseUser.uid);

                    if (!userProfile) {
                        console.log('AuthContext: User profile not found, creating default profile...');
                        // Create default profile
                        const newProfile: User = {
                            uid: firebaseUser.uid,
                            name: firebaseUser.displayName || 'User',
                            email: firebaseUser.email || '',
                            role: 'resident', // Default role
                            createdAt: new Date().toISOString()
                        } as User;

                        // Try to save to Firestore
                        try {
                            await userService.createUserProfile(firebaseUser.uid, newProfile);
                            console.log('AuthContext: Default profile created in Firestore');
                        } catch (createError) {
                            console.error('AuthContext: Failed to save default profile to Firestore', createError);
                            // Proceed with local state anyway so app doesn't crash
                        }

                        userProfile = newProfile;
                    }

                    setUser(userProfile as User);
                } catch (error) {
                    console.error('Error fetching/creating user profile:', error);
                    // Fallback to a basic user object from Auth so the user isn't locked out
                    setUser({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: 'resident'
                    } as User);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
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
            return;
        }

        try {
            console.log("AuthContext: Updating in Firestore...");
            await userService.updateUserProfile(user.uid, data);

            console.log("AuthContext: Updating local state...");
            setUser(prev => prev ? { ...prev, ...data } : null);
        } catch (error) {
            console.error("AuthContext: Failed to update profile in context", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logoutUser();
        } catch (error) {
            console.error("AuthContext: Logout failed", error);
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
