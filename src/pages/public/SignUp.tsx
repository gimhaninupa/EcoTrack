import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { ShieldCheck, Leaf } from 'lucide-react';

export function SignUp() {
  return <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 font-bold text-3xl tracking-tight mb-4">
          <span>
            Eco<span className="text-forest-500">Track</span>
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-neutral-900">
          Create an Account
        </h2>
        <p className="mt-2 text-lg text-neutral-600">
          Select the type of account you wish to create
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Resident Registration */}
        <Link to="/signup/resident" className="group">
          <Card className="h-full border-neutral-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-forest-500">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-forest-50 flex items-center justify-center mb-6 group-hover:bg-forest-100 transition-colors">
                <Leaf className="h-10 w-10 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Resident Registration</h3>
              <p className="text-neutral-500 mb-6 max-w-xs">
                Join to manage your home services, waste collection, and more.
              </p>
              <span className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-forest-600 group-hover:bg-forest-700 transition-colors">
                Register as Resident
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Admin Registration */}
        <Link to="/signup/admin" className="group">
          <Card className="h-full border-neutral-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-forest-500">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
              <div className="h-20 w-20 rounded-full bg-forest-50 flex items-center justify-center mb-6 group-hover:bg-forest-100 transition-colors">
                <ShieldCheck className="h-10 w-10 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Administrator Registration</h3>
              <p className="text-neutral-500 mb-6 max-w-xs">
                Create an account to manage the EcoTrack system and resources.
              </p>
              <span className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-forest-600 group-hover:bg-forest-700 transition-colors">
                Register as Admin
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="text-center mt-8 space-y-4">
        <div>
          <Link to="/login" className="text-neutral-500 hover:text-neutral-700 font-medium">
            Already have an account? Sign in
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