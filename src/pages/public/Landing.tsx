import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck, Truck } from 'lucide-react';
export function Landing() {
  return <div className="min-h-screen bg-white text-neutral-900 font-sans">
    {/* Navigation */}
    <nav className="border-b border-neutral-100 px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-6 w-6 rounded bg-neutral-900" />
          <span>
            Eco<span className="text-forest-500">Track</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            Log in
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>

    {/* Hero */}
    <section className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-7xl mb-8">
          Waste collection & monitoring for the{' '}
          <span className="text-forest-500">modern city</span>.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600 mb-10 leading-relaxed">
          An ultra-clean, data-forward platform for municipalities and
          residents. Streamline collections, track fleets in real-time, and
          resolve issues faster.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="h-14 px-8 text-lg">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
              View Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Features Grid */}
    <section className="bg-neutral-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
              <Truck className="h-6 w-6 text-forest-500" />
            </div>
            <h3 className="text-xl font-semibold">
              Real-time Fleet Tracking
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              Monitor your entire fleet with live GPS updates. Optimize routes
              dynamically and reduce fuel consumption by up to 20%.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
              <BarChart3 className="h-6 w-6 text-forest-500" />
            </div>
            <h3 className="text-xl font-semibold">Data-Driven Insights</h3>
            <p className="text-neutral-600 leading-relaxed">
              Powerful analytics dashboard for administrators. Track
              collection rates, issue resolution times, and operational costs.
            </p>
          </div>
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-6 w-6 text-forest-500" />
            </div>
            <h3 className="text-xl font-semibold">Resident Portal</h3>
            <p className="text-neutral-600 leading-relaxed">
              Empower residents to manage schedules, report issues, and pay
              bills through a clean, accessible interface.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Stats / Social Proof */}
    <section className="px-6 py-24 border-t border-neutral-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-neutral-900 mb-2 font-mono">
              2.5M+
            </div>
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Pickups Logged
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-neutral-900 mb-2 font-mono">
              99.9%
            </div>
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Uptime
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-neutral-900 mb-2 font-mono">
              45%
            </div>
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Cost Reduction
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-neutral-900 mb-2 font-mono">
              24/7
            </div>
            <div className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Support
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-neutral-900 text-neutral-400 py-12 px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="h-6 w-6 rounded bg-white" />
          <span>
            Eco<span className="text-forest-500">Track</span>
          </span>
        </div>
        <div className="text-sm">
          © 2024 EcoTrack Inc. All rights reserved.
        </div>
      </div>
    </footer>
  </div>;
}