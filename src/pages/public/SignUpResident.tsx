import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Leaf } from 'lucide-react';

export function SignUpResident() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '', // Acts as email for now or separate field? User prompt says "username". Firebase needs email.
        address: '',
        password: '',
        email: '' // Added email field as Firebase requires it
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await register(formData.email, formData.password, {
                name: `${formData.firstName} ${formData.lastName}`,
                role: 'resident' as const,
                location: formData.address
            });
            navigate('/resident/dashboard');
        } catch (error: any) {
            console.error(error);
            alert(error.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 font-bold text-2xl tracking-tight mb-6 hover:opacity-80 transition-opacity">
                    <Leaf className="h-6 w-6 text-forest-500" />
                    <span>
                        Eco<span className="text-forest-500">Track</span>
                    </span>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
                    Resident Registration
                </h2>
                <p className="mt-2 text-neutral-600">
                    Create your resident account
                </p>
            </div>

            <Card className="border-neutral-200 shadow-lg border-t-4 border-t-forest-500">
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First name"
                                placeholder="John"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            />
                            <Input
                                label="Last name"
                                placeholder="Doe"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            />
                        </div>
                        <Input
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                        <Input
                            label="Address"
                            placeholder="123 Main St"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        />

                        <div className="text-xs text-neutral-500">
                            By clicking create account, you agree to our{' '}
                            <Link to="#" className="text-forest-600 hover:underline">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link to="#" className="text-forest-600 hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </div>

                        <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700" isLoading={isLoading}>
                            Create Resident Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-500">
                        Already have an account?{' '}
                        <Link to="/login/resident" className="font-medium text-forest-600 hover:text-forest-500">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>

            <div className="text-center">
                <Link to="/signup/admin" className="text-sm text-neutral-500 hover:text-neutral-900">
                    Need to register as an administrator?
                </Link>
            </div>
        </div>
    </div>;
}
