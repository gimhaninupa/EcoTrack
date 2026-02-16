import React from 'react';
import { cn } from '../../utils/cn';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Map, AlertCircle, History, Bell, CreditCard, Settings, Truck, Users, FileText, BarChart3, LogOut } from 'lucide-react';
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
    href: '/admin/routes',
    label: 'Route Mgmt',
    icon: Map
  }, {
    href: '/admin/fleet',
    label: 'Fleet Tracking',
    icon: Truck
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
    href: '/admin/users',
    label: 'User Mgmt',
    icon: Users
  }, {
    href: '/admin/settings',
    label: 'System',
    icon: Settings
  }];
  const links = type === 'resident' ? residentLinks : adminLinks;
  return <aside className={cn('fixed inset-y-0 left-0 z-40 w-64 transform border-r border-neutral-100 bg-white/90 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0', isOpen ? 'translate-x-0' : '-translate-x-full')}>
    <div className="flex h-16 items-center px-6 border-b border-forest-100 bg-transparent">
      <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <span>
          Eco<span className="text-forest-500">Track</span>
        </span>
      </div>
    </div>

    <div className="flex flex-col justify-between h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.href;
          return <Link key={link.href} to={link.href} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200', isActive ? 'bg-forest-50 text-forest-700 shadow-sm' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900')}>
            <Icon className={cn('h-5 w-5', isActive ? 'text-forest-600' : 'text-neutral-400 group-hover:text-neutral-600')} />
            {link.label}
          </Link>;
        })}
      </nav>

      <div className="border-t border-neutral-200 pt-4 mt-4">
        <div className="px-3 py-2 mb-2">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">
            Current User
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold">
              {user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'G'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-900">
                {user ? user.name : 'Guest'}
              </span>
              <span className="text-xs text-neutral-500 capitalize">
                {user ? user.role : 'Visitor'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            navigate('/');
            // Add a small delay to allow unmounting to complete before signing out
            setTimeout(() => {
              logout();
            }, 100);
          }}
          className="w-full flex items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  </aside>;
}