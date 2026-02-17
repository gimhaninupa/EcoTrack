import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Truck } from 'lucide-react';

export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    password: '',
    email: ''
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

      // Redirect based on email (Super Admin check)
      if (formData.email.toLowerCase() === 'admin@ecotrack.lk') {
        navigate('/admin/dashboard');
      } else {
        navigate('/resident/dashboard');
      }
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
        <Link to="/" className="inline-flex items-center justify-center gap-3 font-bold text-3xl tracking-tight mb-6 hover:opacity-80 transition-opacity">
          <div className="bg-forest-600 p-2 rounded-xl shadow-sm">
            <Truck className="h-8 w-8 text-white stroke-[2.5]" />
          </div>
          <span className="flex items-center">
            <span className="text-neutral-900">Eco</span>
            <span className="text-forest-600">Track</span>
          </span>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Create an Account
        </h2>
        <p className="mt-2 text-neutral-600">
          Join us effectively manage your waste
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
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-forest-600 hover:text-forest-500">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Back to Home
        </Link>
      </div>
    </div>
  </div>;
}