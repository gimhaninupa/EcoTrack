import { cn } from '../../utils/cn';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Map, AlertCircle, History, Bell, CreditCard, Settings, Truck, Users, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  type: 'resident' | 'admin';
}

export function Sidebar({
  isOpen,
  type
}: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const residentLinks = [{
    href: '/resident/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    href: '/resident/schedule',
    label: 'Schedule',
    icon: Calendar
  }, {
    href: '/resident/tracking',
    label: 'Live Tracking',
    icon: Map
  }, {
    href: '/resident/report',
    label: 'Report Issue',
    icon: AlertCircle
  }, {
    href: '/resident/history',
    label: 'History',
    icon: History
  }, {
    href: '/resident/notifications',
    label: 'Notifications',
    icon: Bell
  }, {
    href: '/resident/billing',
    label: 'Billing',
    icon: CreditCard
  }, {
    href: '/resident/settings',
    label: 'Settings',
    icon: Settings
  }];

  const adminLinks = [{
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    href: '/admin/fleet',
    label: 'Fleet Tracking',
    icon: Truck
  }, {
    href: '/admin/routes',
    label: 'Route Mgmt',
    icon: Map
  }, {
    href: '/admin/issues',
    label: 'Issues',
    icon: AlertCircle
  }, {
    href: '/admin/residents',
    label: 'Directory',
    icon: Users
  }, {
    href: '/admin/schedule',
    label: 'Schedule Builder',
    icon: Calendar
  }, {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3
  }, {
    href: '/admin/billing',
    label: 'Billing',
    icon: CreditCard
  }, {
    href: '/admin/settings',
    label: 'System',
    icon: Settings
  }];

  const links = type === 'resident' ? residentLinks : adminLinks;

  return (
    <aside className={cn('fixed inset-y-0 left-0 z-40 w-72 transform border-r border-neutral-200/60 bg-white/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full')}>
      <div className="flex h-20 items-center px-8 border-b border-neutral-100">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <div className="bg-forest-500 rounded-lg p-1.5">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="text-neutral-900">
            Eco<span className="text-forest-600">Track</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between h-[calc(100vh-5rem)] p-4">
        <nav className="space-y-1 mt-4">
          <div className="px-4 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Menu
          </div>
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive ? 'bg-forest-50 text-forest-700 shadow-sm' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-5 w-5 transition-colors', isActive ? 'text-forest-600' : 'text-neutral-400 group-hover:text-neutral-600')} />
                  {link.label}
                </div>
                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-forest-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="bg-neutral-50/50 rounded-2xl p-4 border border-neutral-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold shadow-sm border border-forest-200">
              {user ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2) : 'G'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold text-neutral-900 truncate">
                {user ? user.name : 'Guest'}
              </span>
              <span className="text-xs text-neutral-500 capitalize truncate">
                {user ? user.role : 'Visitor'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              navigate('/');
              setTimeout(() => {
                logout();
              }, 100);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}