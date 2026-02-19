import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { Truck } from 'lucide-react';
import { userService } from '../../services/userService';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { login, logout, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // 1. Auto-Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'resident') {
        navigate('/resident/dashboard', { replace: true });
      } else if (user.role === 'admin') {
        // If admin lands here, redirect to admin dashboard
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Authenticate
      // This will trigger onAuthStateChanged in AuthContext, which updates 'user'
      // The useEffect above will handle the redirect.
      await login(formData.email, formData.password);

    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false); // Only stop loading on error
    }
    // Do NOT set isLoading(false) in finally block if successful, 
    // because we want the button to stay loading until redirect happens.
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
          Resident Login
        </h2>
        <p className="mt-2 text-neutral-600">
          Sign in to manage your account
        </p>
      </div>

      <Card className="border-neutral-200 shadow-lg border-t-4 border-t-forest-500">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-600">
                <input type="checkbox" className="rounded border-neutral-300 text-forest-600 focus:ring-forest-500" />
                Remember me
              </label>
              <Link to="#" className="text-forest-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full bg-forest-600 hover:bg-forest-700" isLoading={isLoading}>
              Sign In
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
        <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Back to Home
        </Link>
      </div>
    </div>
  </div>;
}