import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export function LoginAdmin() {
    const navigate = useNavigate();
    const { login, logout, user } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Force Logout on Mount
    React.useEffect(() => {
        const performLogout = async () => {
            if (user) {
                await logout();
            }
        };
        performLogout();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // This will trigger onAuthStateChanged in AuthContext, which updates 'user'
            // The useEffect above will handle the redirect.
            await login(formData.email, formData.password);

            // We don't need to do manual checks here anymore because the useEffect
            // will catch the new 'user' state. 
            // However, we can keep a check for immediate feedback if needed, 
            // but relying on the effect is safer for the race condition.

        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Login failed');
            setIsSubmitting(false); // Only stop loading on error, otherwise wait for redirect
        }
    };

    return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 font-bold text-2xl tracking-tight mb-6 hover:opacity-80 transition-opacity">
                    <ShieldCheck className="h-6 w-6 text-forest-500" />
                    <span>
                        Eco<span className="text-forest-500">Track</span> Admin
                    </span>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                    Administrator Access
                </h2>
                <p className="mt-2 text-neutral-600">
                    Secure system management portal
                </p>
            </div>

            <Card className="border-neutral-200 shadow-lg border-t-4 border-t-forest-500">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Admin Email"
                            type="email"
                            placeholder="admin@ecotrack.lk"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-neutral-700">
                                    Password
                                </label>
                            </div>
                            <Input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            />
                        </div>

                        <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700" isLoading={isSubmitting}>
                            Authenticate
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="text-center">
                <Link to="/login/resident" className="text-sm text-neutral-500 hover:text-neutral-900">
                    Switch to Resident Portal
                </Link>
            </div>
        </div>
    </div>;
}
