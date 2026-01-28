import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
export function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'resident' | 'admin'>('resident');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(role === 'admin' ? '/admin/dashboard' : '/resident/dashboard');
    }, 1000);
  };
  return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-2xl tracking-tight mb-6">
          <span>
            Eco<span className="text-forest-500">Track</span>
          </span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
          Create an account
        </h2>
        <p className="mt-2 text-neutral-600">
          Start managing your services today
        </p>
      </div>

      <Card className="border-neutral-200 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex p-1 bg-neutral-100 rounded-lg mb-6">
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'resident' ? 'bg-white shadow-sm text-forest-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setRole('resident')}
            >
              Resident
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'admin' ? 'bg-white shadow-sm text-forest-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setRole('admin')}
            >
              Administrator
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First name" placeholder="John" required />
              <Input label="Last name" placeholder="Doe" required />
            </div>
            <Input label="Email address" type="email" placeholder="name@example.com" required />
            <Input label="Address" placeholder="123 Main St" required />
            <Input label="Password" type="password" required />

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

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create account
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
    </div>
  </div>;
}