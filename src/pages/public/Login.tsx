import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { ShieldCheck, Leaf } from 'lucide-react';

export function Login() {
  return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-3xl tracking-tight mb-4">
          <span>
            Eco<span className="text-forest-500">Track</span>
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-neutral-900">
          Select Your Portal
        </h2>
        <p className="mt-2 text-lg text-neutral-600">
          Choose the appropriate login to continue
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Resident Portal */}
        <Link to="/login/resident" className="group">
          <Card className="h-full border-neutral-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-forest-500">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-forest-50 flex items-center justify-center mb-6 group-hover:bg-forest-100 transition-colors">
                <Leaf className="h-10 w-10 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Resident Portal</h3>
              <p className="text-neutral-500 mb-6 max-w-xs">
                Manage your home services, report issues, and view schedules.
              </p>
              <span className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-forest-600 group-hover:bg-forest-700 transition-colors">
                Login as Resident
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Admin Portal */}
        <Link to="/login/admin" className="group">
          <Card className="h-full border-neutral-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-forest-500">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-forest-50 flex items-center justify-center mb-6 group-hover:bg-forest-100 transition-colors">
                <ShieldCheck className="h-10 w-10 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Administrator Portal</h3>
              <p className="text-neutral-500 mb-6 max-w-xs">
                Access system controls, manage users, and view analytics.
              </p>
              <span className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-forest-600 group-hover:bg-forest-700 transition-colors">
                Login as Admin
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="text-center mt-8 space-y-4">
        <div>
          <span className="text-neutral-600">Don't have an account? </span>
          <Link to="/signup" className="text-forest-600 hover:text-forest-700 font-medium hover:underline">
            Sign up
          </Link>
        </div>
        <div>
          <Link to="/" className="text-neutral-500 hover:text-neutral-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  </div>;
}