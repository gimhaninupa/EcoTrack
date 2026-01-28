import React, { createContext, useContext } from 'react';
import { cn } from '../../utils/cn';
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}
const TabsContext = createContext<TabsContextType | undefined>(undefined);
export function Tabs({
  value,
  onValueChange,
  children,
  className
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return <TabsContext.Provider value={{
    value,
    onValueChange
  }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>;
}
export function TabsList({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('inline-flex h-10 items-center justify-center rounded-md bg-neutral-100 p-1 text-neutral-500', className)}>
      {children}
    </div>;
}
export function TabsTrigger({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  const isActive = context.value === value;
  return <button className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', isActive ? 'bg-white text-neutral-950 shadow-sm' : 'hover:bg-neutral-200/50 hover:text-neutral-900', className)} onClick={() => context.onValueChange(value)}>
      {children}
    </button>;
}
export function TabsContent({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  if (context.value !== value) return null;
  return <div className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2', className)}>
      {children}
    </div>;
}