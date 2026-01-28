import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
}
export function SearchBar({
  onSearch,
  className,
  ...props
}: SearchBarProps) {
  return <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
      <Input className="pl-9" placeholder="Search..." onChange={e => onSearch(e.target.value)} {...props} />
    </div>;
}