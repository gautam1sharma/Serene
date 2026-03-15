import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { CustomerAuthLayout } from '@/components/layout/CustomerAuthLayout';
import { AdminAuthLayout } from '@/components/layout/AdminAuthLayout';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AdminLoginPage } from '@/pages/auth/AdminLoginPage';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Role-Based Dashboards
import { CarConfigurator } from '@/pages/public/CarConfigurator';
import { AboutPage } from '@/pages/public/AboutPage';
import { SupportPage } from '@/pages/public/SupportPage';
import { DealershipLocator } from '@/pages/public/DealershipLocator';
import { CustomerDashboard } from '@/dashboards/customer/CustomerDashboard';
import { DealerDashboard } from '@/dashboards/dealer/DealerDashboard';
import { ManagerDashboard } from '@/dashboards/manager/ManagerDashboard';
import { CEODashboard } from '@/dashboards/ceo/CEODashboard';

// Customer Pages
import { CarBrowser } from '@/dashboards/customer/CarBrowser';
import { CarDetails } from '@/dashboards/customer/CarDetails';
import { MyTestDrives } from '@/dashboards/customer/MyTestDrives';
import { MyOrders } from '@/dashboards/customer/MyOrders';
import { MyInquiries } from '@/dashboards/customer/MyInquiries';

// Dealer Pages
import { InventoryManagement } from '@/dashboards/dealer/InventoryManagement';
import { CustomerInquiries } from '@/dashboards/dealer/CustomerInquiries';
import { TestDriveSchedule } from '@/dashboards/dealer/TestDriveSchedule';
import { SalesProcessing } from '@/dashboards/dealer/SalesProcessing';

// Manager Pages
import { TeamManagement } from '@/dashboards/manager/TeamManagement';
import { DealershipOperations } from '@/dashboards/manager/DealershipOperations';
import { SalesReports } from '@/dashboards/manager/SalesReports';

// CEO Pages
import { MultiDealershipView } from '@/dashboards/ceo/MultiDealershipView';
import { FinancialAnalytics } from '@/dashboards/ceo/FinancialAnalytics';
import { StrategicPlanning } from '@/dashboards/ceo/StrategicPlanning';
import { UserManagement } from '@/dashboards/ceo/UserManagement';

// Shared Components
import { NotificationsPage } from '@/pages/shared/NotificationsPage';
import { ProfilePage } from '@/pages/shared/ProfilePage';
import { SettingsPage } from '@/pages/shared/SettingsPage';

// Role-Based Route Guard
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user) {
      switch (user.role) {
        case UserRole.CUSTOMER:
          return <Navigate to="/customer" replace />;
        case UserRole.DEALER:
          return <Navigate to="/dealer" replace />;
        case UserRole.MANAGER:
          return <Navigate to="/manager" replace />;
        case UserRole.CEO:
        case UserRole.ADMIN:
          return <Navigate to="/ceo" replace />;
        default:
          return <Navigate to="/login" replace />;
      }
    }
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auto-redirect based on role
const AutoRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user) {
    switch (user.role) {
      case UserRole.CUSTOMER:
        return <Navigate to="/customer" replace />;
      case UserRole.DEALER:
        return <Navigate to="/dealer" replace />;
      case UserRole.MANAGER:
        return <Navigate to="/manager" replace />;
      case UserRole.CEO:
      case UserRole.ADMIN:
        return <Navigate to="/ceo" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Customer Auth Routes (light theme) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin/Staff Auth Routes (dark DMS theme) */}
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        {/* Public routes within MainLayout */}
        <Route path="/cars" element={<CarBrowser />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/cars/:id/build" element={<CarConfigurator />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/dealerships" element={<DealershipLocator />} />

        {/* Auto-redirect dashboard to appropriate role dashboard */}
        <Route path="/dashboard" element={<AutoRedirect />} />

        {/* Customer Routes */}
        <Route
          path="/customer/*"
          element={
            <RoleGuard allowedRoles={[UserRole.CUSTOMER]}>
              <Routes>
                <Route index element={<CustomerDashboard />} />
                <Route path="test-drives" element={<MyTestDrives />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="inquiries" element={<MyInquiries />} />
              </Routes>
            </RoleGuard>
          }
        />

        {/* Dealer Routes */}
        <Route
          path="/dealer/*"
          element={
            <RoleGuard allowedRoles={[UserRole.DEALER]}>
              <Routes>
                <Route index element={<DealerDashboard />} />
                <Route path="inventory" element={<InventoryManagement />} />
                <Route path="inquiries" element={<CustomerInquiries />} />
                <Route path="test-drives" element={<TestDriveSchedule />} />
                <Route path="sales" element={<SalesProcessing />} />
              </Routes>
            </RoleGuard>
          }
        />

        {/* Manager Routes */}
        <Route
          path="/manager/*"
          element={
            <RoleGuard allowedRoles={[UserRole.MANAGER]}>
              <Routes>
                <Route index element={<ManagerDashboard />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="operations" element={<DealershipOperations />} />
                <Route path="reports" element={<SalesReports />} />
              </Routes>
            </RoleGuard>
          }
        />

        {/* CEO/Admin Routes */}
        <Route
          path="/ceo/*"
          element={
            <RoleGuard allowedRoles={[UserRole.CEO, UserRole.ADMIN]}>
              <Routes>
                <Route index element={<CEODashboard />} />
                <Route path="dealerships" element={<MultiDealershipView />} />
                <Route path="financials" element={<FinancialAnalytics />} />
                <Route path="strategy" element={<StrategicPlanning />} />
                <Route path="users" element={<UserManagement />} />
              </Routes>
            </RoleGuard>
          }
        />

        {/* Shared Routes */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all — send unknown routes to 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          toastOptions={{
            style: {
              fontFamily: 'inherit',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
