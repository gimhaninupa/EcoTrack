import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/public/Landing';
import { Login } from './pages/public/Login';
import { LoginResident } from './pages/public/LoginResident';
import { LoginAdmin } from './pages/public/LoginAdmin';
import { SignUp } from './pages/public/SignUp';
import { SignUpResident } from './pages/public/SignUpResident';
import { SignUpAdmin } from './pages/public/SignUpAdmin';
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
import { AdminFleetTracking } from './pages/admin/FleetTracking';
import { AdminIssueManagement } from './pages/admin/IssueManagement';
import { AdminResidentDirectory } from './pages/admin/ResidentDirectory';
import { AdminScheduleBuilder } from './pages/admin/ScheduleBuilder';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminBillingManagement } from './pages/admin/BillingManagement';
import { AdminUserManagement } from './pages/admin/UserManagement';
import { AdminSystemSettings } from './pages/admin/SystemSettings';
import { ServiceProvider } from './context/ServiceContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

export default function App() {
  console.log('App.tsx: Rendering App component...');
  return (
    <AuthProvider>
      <AdminProvider>
        <ServiceProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/resident" element={<LoginResident />} />
              <Route path="/login/admin" element={<LoginAdmin />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signup/resident" element={<SignUpResident />} />
              <Route path="/signup/admin" element={<SignUpAdmin />} />

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
                <Route path="fleet" element={<AdminFleetTracking />} />
                <Route path="issues" element={<AdminIssueManagement />} />
                <Route path="residents" element={<AdminResidentDirectory />} />
                <Route path="schedule" element={<AdminScheduleBuilder />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="billing" element={<AdminBillingManagement />} />
                <Route path="users" element={<AdminUserManagement />} />
                <Route path="settings" element={<AdminSystemSettings />} />
                <Route path="notifications" element={<AdminIssueManagement />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ServiceProvider>
      </AdminProvider>
    </AuthProvider>
  );
}