import { useState, useEffect } from 'react';

// Mock auth hook
export function useAuth() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: 'resident' | 'admin';
  } | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Simulate checking auth
    const timer = setTimeout(() => {
      setUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'resident'
      });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return {
    user,
    loading
  };
}