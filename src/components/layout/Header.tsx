import React from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
interface HeaderProps {
  onMenuClick: () => void;
  title: string;
}
export function Header({
  onMenuClick,
  title
}: HeaderProps) {
  return <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-6">
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
      <Menu className="h-5 w-5" />
    </Button>

    <div className="flex-1">
      <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
    </div>

    <div className="hidden w-full max-w-sm lg:flex items-center relative">
      <Search className="absolute left-2.5 h-4 w-4 text-neutral-500" />
      <Input placeholder="Search (Cmd+K)" className="pl-9 bg-neutral-50 border-transparent focus:bg-white focus:border-forest-500" />
    </div>

    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5 text-neutral-500" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-forest-500" />
      </Button>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5 text-neutral-500" />
      </Button>
    </div>
  </header>;
}