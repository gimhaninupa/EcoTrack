import { Bell, Menu, Search, Settings } from 'lucide-react';
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
  const navigate = useNavigate();
  const location = useLocation();
  const isResident = location.pathname.startsWith('/resident');
  const basePath = isResident ? '/resident' : '/admin';

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 bg-white/80 backdrop-blur-md px-8 border-b border-neutral-100/50 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden hover:bg-neutral-100" onClick={onMenuClick}>
          <Menu className="h-5 w-5 text-neutral-600" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{title}</h1>
          <p className="text-xs text-neutral-500 hidden sm:block">Welcome back to EcoTrack</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden w-full max-w-sm lg:flex items-center relative group">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400 group-focus-within:text-forest-600 transition-colors" />
          <Input
            placeholder="Search..."
            className="pl-10 h-11 w-64 rounded-full bg-neutral-100/50 border-transparent focus:bg-white focus:border-forest-500 focus:ring-4 focus:ring-forest-100 transition-all duration-300 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 border-l border-neutral-200 pl-6 h-8">
          <Button variant="ghost" size="icon" className="relative hover:bg-neutral-50 rounded-full h-10 w-10 transition-colors" onClick={() => navigate(`${basePath}/notifications`)}>
            <Bell className="h-5 w-5 text-neutral-500" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 border border-white" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-neutral-50 rounded-full h-10 w-10 transition-colors" onClick={() => navigate(`${basePath}/settings`)}>
            <Settings className="h-5 w-5 text-neutral-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}