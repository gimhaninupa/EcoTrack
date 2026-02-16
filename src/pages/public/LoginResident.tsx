import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Leaf } from 'lucide-react';

export function LoginResident() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await login(formData.username, formData.password);
            navigate('/resident/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 font-bold text-2xl tracking-tight mb-6 hover:opacity-80 transition-opacity">
                    <Leaf className="h-6 w-6 text-forest-500" />
                    <span>
                        Eco<span className="text-forest-500">Track</span>
                    </span>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                    Resident Login
                </h2>
                <p className="mt-2 text-neutral-600">
                    Access your home services portal
                </p>
            </div>

            <Card className="border-neutral-200 shadow-lg border-t-4 border-t-forest-500">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Username"
                            type="text"
                            placeholder="Enter your username"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        />
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-neutral-700">
                                    Password
                                </label>
                                <Link to="#" className="text-xs font-medium text-forest-600 hover:text-forest-500">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-neutral-300 text-forest-600 focus:ring-forest-500" />
                            <label htmlFor="remember" className="text-sm text-neutral-600">
                                Remember me for 30 days
                            </label>
                        </div>

                        <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700" isLoading={isSubmitting}>
                            Sign in as Resident
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-500">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-forest-600 hover:text-forest-500">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <Link to="/login/admin" className="text-sm text-neutral-500 hover:text-neutral-900">
                    Are you an administrator?
                </Link>
            </div>
        </div>
    </div>;
}
