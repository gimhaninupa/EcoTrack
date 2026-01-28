import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isResident = location.pathname.startsWith('/resident');
  const type = isResident ? 'resident' : 'admin';
  // Determine title based on path
  const getTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };
  return <div className="flex min-h-screen bg-neutral-50">
    <Sidebar isOpen={sidebarOpen} type={type} />

    <div className="flex-1 flex flex-col min-w-0">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} title={getTitle()} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mx-auto max-w-7xl animate-in fade-in duration-500 slide-in-from-bottom-4">
          <Outlet />
        </div>
      </main>
    </div>

    {/* Mobile overlay */}
    {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
  </div>;
}