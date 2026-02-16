import React from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNavigate, useLocation } from 'react-router-dom';
interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}
export function Header({
  onMenuClick,
  title
}: HeaderProps) {
  /* ... imports ... */
  const navigate = useNavigate();
  const location = useLocation();
  const isResident = location.pathname.startsWith('/resident');
  const basePath = isResident ? '/resident' : '/admin';

  return <header className="sticky top-0 z-30 flex h-16 items-center gap-4 bg-white/80 backdrop-blur-md px-6 border-b border-neutral-100">
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
      <Menu className="h-5 w-5" />
    </Button>

    <div className="flex-1">
      <h1 className="text-xl font-bold text-neutral-900 tracking-tight">{title}</h1>
    </div>

    <div className="hidden w-full max-w-sm lg:flex items-center relative">
      <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
      <Input placeholder="Search..." className="pl-10 h-10 rounded-full bg-neutral-100/50 border-transparent focus:bg-white focus:border-forest-500 focus:ring-2 focus:ring-forest-100 transition-all" />
    </div>

    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative" onClick={() => navigate(`${basePath}/notifications`)}>
        <Bell className="h-5 w-5 text-neutral-500" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-forest-500" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => navigate(`${basePath}/settings`)}>
        <User className="h-5 w-5 text-neutral-500" />
      </Button>
    </div>
  </header>;
}