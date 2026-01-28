import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/public/Login';
import { SignUp } from './pages/public/SignUp';
import { DashboardLayout } from './components/layout/DashboardLayout';
// Resident Pages
import { ResidentDashboard } from './pages/resident/Dashboard';
import { ResidentSchedule } from './pages/resident/Schedule';
import { ResidentTracking } from './pages/resident/Tracking';
import { ResidentReportIssue } from './pages/resident/ReportIssue';
import { ResidentIssueHistory } from './pages/resident/IssueHistory';
import { ResidentNotifications } from './pages/resident/Notifications';
import { ResidentPaymentHistory } from './pages/resident/PaymentHistory';
import { ResidentSettings } from './pages/resident/Settings';
// Admin Pages
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminRouteManagement } from './pages/admin/RouteManagement';
// Placeholders for remaining Admin pages
const Placeholder = ({
  title
}: {
  title: string;
}) => <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <p className="text-neutral-500">This page is under construction.</p>
  </div>;
import { ServiceProvider } from './context/ServiceContext';

export default function App() {
  return (
    <ServiceProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Resident Routes */}
          <Route path="/resident" element={<DashboardLayout />}>
            <Route path="dashboard" element={<ResidentDashboard />} />
            <Route path="schedule" element={<ResidentSchedule />} />
            <Route path="tracking" element={<ResidentTracking />} />
            <Route path="report" element={<ResidentReportIssue />} />
            <Route path="history" element={<ResidentIssueHistory />} />
            <Route path="notifications" element={<ResidentNotifications />} />
            <Route path="billing" element={<ResidentPaymentHistory />} />
            <Route path="settings" element={<ResidentSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="routes" element={<AdminRouteManagement />} />
            <Route path="fleet" element={<Placeholder title="Fleet Tracking" />} />
            <Route path="issues" element={<Placeholder title="Issue Management" />} />
            <Route path="residents" element={<Placeholder title="Resident Directory" />} />
            <Route path="schedule" element={<Placeholder title="Schedule Builder" />} />
            <Route path="analytics" element={<Placeholder title="Analytics" />} />
            <Route path="billing" element={<Placeholder title="Billing Management" />} />
            <Route path="users" element={<Placeholder title="User Management" />} />
            <Route path="settings" element={<Placeholder title="System Settings" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ServiceProvider>
  );
}