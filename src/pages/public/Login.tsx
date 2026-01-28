import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      setIsLoading(false);
      navigate('/resident/dashboard');
    }, 1000);
  };
  return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-2xl tracking-tight mb-6">
            <div className="h-8 w-8 rounded bg-neutral-900" />
            <span>
              Eco<span className="text-sky-500">Track</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Welcome back
          </h2>
          <p className="mt-2 text-neutral-600">
            Sign in to your account to continue
          </p>
        </div>

        <Card className="border-neutral-200 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Email address" type="email" placeholder="name@example.com" required />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-neutral-700">
                    Password
                  </label>
                  <Link to="#" className="text-xs font-medium text-sky-600 hover:text-sky-500">
                    Forgot password?
                  </Link>
                </div>
                <Input type="password" required />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-neutral-300 text-sky-600 focus:ring-sky-500" />
                <label htmlFor="remember" className="text-sm text-neutral-600">
                  Remember me for 30 days
                </label>
              </div>

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-neutral-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-sky-600 hover:text-sky-500">
                Sign up
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-100">
              <div className="text-xs text-center text-neutral-400 mb-3">
                Quick Access (Demo)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => navigate('/resident/dashboard')}>
                  Resident Demo
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/dashboard')}>
                  Admin Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}