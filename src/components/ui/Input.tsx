import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  ...props
}, ref) => {
  return <div className="w-full space-y-1.5">
    {label && <label className="text-sm font-medium text-neutral-700">
      {label}
    </label>}
    <input ref={ref} className={cn('flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 disabled:cursor-not-allowed disabled:opacity-50', error && 'border-red-500 focus:border-red-500 focus:ring-red-500', className)} {...props} />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>;
});
Input.displayName = 'Input';