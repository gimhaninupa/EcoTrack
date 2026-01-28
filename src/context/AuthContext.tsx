import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    name: string;
    email: string;
    role: 'resident' | 'admin';
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: 'resident' | 'admin') => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check localStorage for persisted user
        const storedUser = localStorage.getItem('ecotrack_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = (email: string, role: 'resident' | 'admin') => {
        // Extract name from email (e.g., "john.doe@example.com" -> "John Doe")
        const namePart = email.split('@')[0];
        const name = namePart
            .split('.')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');

        const newUser = { name, email, role };
        setUser(newUser);
        localStorage.setItem('ecotrack_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ecotrack_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
