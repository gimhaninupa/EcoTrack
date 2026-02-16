import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ArrowRight, CheckCircle2, BarChart3, ShieldCheck, Truck, Menu, X, ChevronRight } from 'lucide-react';

export function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans overflow-x-hidden selection:bg-forest-100 selection:text-forest-900">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-forest-200/40 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-forest-100/40 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-neutral-200/50 py-3 shadow-sm' : 'bg-transparent py-5'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight z-50">
            <div className="h-8 w-8 bg-forest-500 rounded-lg flex items-center justify-center text-white">
              <Truck className="h-5 w-5" />
            </div>
            <span>
              Eco<span className="text-forest-600">Track</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* Links removed */}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-base font-medium text-neutral-600 hover:text-forest-600 transition-colors">
              Log in
            </Link>
            <Link to="/signup">
              <Button size="lg" className="rounded-full px-8 py-6 text-base bg-forest-600 hover:bg-forest-700 shadow-lg shadow-forest-200/50 transition-all hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 p-2 text-neutral-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-medium">Log in</Link>
          <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
            <Button size="lg" className="rounded-full w-full text-xl px-10 py-4">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest-700 text-sm font-medium mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-500"></span>
                </span>
                Now live in 5 major cities
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 mb-6 leading-[1.1]">
                Smart waste for the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-500 to-forest-700">modern world.</span>
              </h1>

              <p className="text-lg text-neutral-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Transform waste management with AI-driven routes, real-time fleet tracking, and a seamless platform for municipalities and residents.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-16 px-10 text-xl rounded-full bg-forest-600 hover:bg-forest-700 shadow-xl shadow-forest-200/50 transition-all hover:-translate-y-1">
                    Get Started <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-forest-500" /> No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-forest-500" /> Easy to use
                </div>
              </div>
            </div>

            <div className="flex-1 relative z-10 w-full max-w-xl lg:max-w-none">
              <div className="relative animate-float">
                <div className="absolute -inset-1 bg-gradient-to-r from-forest-400 to-blue-400 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden aspect-[4/3] flex items-center justify-center group">
                  {/* Abstract Dashboard Mockup */}
                  <div className="absolute inset-0 bg-neutral-50 p-6 flex flex-col gap-4">
                    <div className="h-8 w-1/3 bg-neutral-200 rounded-md"></div>
                    <div className="flex gap-4">
                      <div className="flex-1 h-32 bg-forest-50 rounded-xl border border-forest-100 p-4">
                        <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center mb-2">
                          <Truck className="h-4 w-4 text-forest-600" />
                        </div>
                        <div className="h-4 w-12 bg-forest-200 rounded mb-1"></div>
                        <div className="h-6 w-16 bg-forest-300 rounded"></div>
                      </div>
                      <div className="flex-1 h-32 bg-white rounded-xl border border-neutral-100 shadow-sm p-4"></div>
                      <div className="flex-1 h-32 bg-white rounded-xl border border-neutral-100 shadow-sm p-4 hidden sm:block"></div>
                    </div>
                    <div className="flex-1 bg-white rounded-xl border border-neutral-100 shadow-sm p-4 gap-3 flex flex-col">
                      <div className="flex items-center gap-2 border-b border-neutral-50 pb-2">
                        <div className="h-8 w-8 rounded-full bg-neutral-100"></div>
                        <div className="h-3 w-32 bg-neutral-100 rounded"></div>
                      </div>
                      <div className="h-2 w-full bg-neutral-50 rounded"></div>
                      <div className="h-2 w-4/5 bg-neutral-50 rounded"></div>
                      <div className="h-2 w-full bg-neutral-50 rounded"></div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -right-6 top-10 bg-white p-4 rounded-xl shadow-xl border border-neutral-100 animate-bounce delay-700 animation-duration-3000">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 font-medium">Route Completed</div>
                        <div className="text-sm font-bold text-neutral-900">District A-4</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -left-6 bottom-20 bg-white p-4 rounded-xl shadow-xl border border-neutral-100 animate-bounce delay-1000 animation-duration-4000 hidden sm:block">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs text-neutral-500 font-medium">Fleet Status</div>
                        <div className="text-sm font-bold text-neutral-900">98% Active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#features" className="text-neutral-400 hover:text-forest-500 transition-colors">
            <ChevronRight className="h-8 w-8 rotate-90" />
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-neutral-50/50 -skew-y-3 transform origin-top-left scale-110 z-0"></div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mb-4">
              Everything you need to manage city waste.
            </h2>
            <p className="text-lg text-neutral-600">
              Powerful tools for administrators, drivers, and residents. All in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-6 w-6 text-white" />,
                title: "Real-time Tracking",
                desc: "Monitor your entire fleet with live GPS updates. Optimize routes dynamically and reduce fuel consumption.",
                color: "bg-blue-500"
              },
              {
                icon: <BarChart3 className="h-6 w-6 text-white" />,
                title: "Data-Driven Insights",
                desc: "Powerful analytics. Track collection rates, issue resolution times, and operational costs.",
                color: "bg-purple-500"
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-white" />,
                title: "Citizen Portal",
                desc: "Empower residents to manage schedules, report issues, and pay bills through a clean interface.",
                color: "bg-forest-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 hover:-translate-y-1">
                <div className={`h-12 w-12 rounded-xl ${feature.color} flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-forest-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-4">
                  {feature.desc}
                </p>
                <div className="flex items-center text-forest-600 font-medium text-sm group-hover:translate-x-1 transition-transform cursor-pointer">
                  Learn more <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Stats Section */}
      < section className="py-24 bg-neutral-900 text-white relative overflow-hidden" >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute bg-forest-500 w-96 h-96 rounded-full blur-3xl -top-20 -left-20"></div>
          <div className="absolute bg-blue-500 w-96 h-96 rounded-full blur-3xl bottom-0 right-0"></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Pickups Logged", value: "2.5M+" },
              { label: "Uptime", value: "99.9%" },
              { label: "Cost Reduction", value: "45%" },
              { label: "Support", value: "24/7" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

    </div >
  );
}