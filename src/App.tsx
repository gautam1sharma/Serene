import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

// Layouts — keep static since they wrap every page
import { MainLayout } from '@/components/layout/MainLayout';

// Lightweight auth pages — keep static for fast initial paint
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { AdminLoginPage } from '@/pages/auth/AdminLoginPage';
import { HomePage } from '@/pages/HomePage';
import { LandingPage } from '@/pages/LandingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// ── Lazy-loaded route chunks ────────────────────────────────────────────
// Public pages
const CarConfigurator = React.lazy(() => import('@/pages/public/CarConfigurator').then(m => ({ default: m.CarConfigurator })));
const AboutPage = React.lazy(() => import('@/pages/public/AboutPage').then(m => ({ default: m.AboutPage })));
const SupportPage = React.lazy(() => import('@/pages/public/SupportPage').then(m => ({ default: m.SupportPage })));
const DealershipLocator = React.lazy(() => import('@/pages/public/DealershipLocator').then(m => ({ default: m.DealershipLocator })));

// Customer dashboard + pages
const CustomerDashboard = React.lazy(() => import('@/dashboards/customer/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const CarBrowser = React.lazy(() => import('@/dashboards/customer/CarBrowser').then(m => ({ default: m.CarBrowser })));
const CarDetails = React.lazy(() => import('@/dashboards/customer/CarDetails').then(m => ({ default: m.CarDetails })));
const MyTestDrives = React.lazy(() => import('@/dashboards/customer/MyTestDrives').then(m => ({ default: m.MyTestDrives })));
const MyOrders = React.lazy(() => import('@/dashboards/customer/MyOrders').then(m => ({ default: m.MyOrders })));
const MyInquiries = React.lazy(() => import('@/dashboards/customer/MyInquiries').then(m => ({ default: m.MyInquiries })));

// Dealer dashboard + pages
const DealerDashboard = React.lazy(() => import('@/dashboards/dealer/DealerDashboard').then(m => ({ default: m.DealerDashboard })));
const InventoryManagement = React.lazy(() => import('@/dashboards/dealer/InventoryManagement').then(m => ({ default: m.InventoryManagement })));
const CustomerInquiries = React.lazy(() => import('@/dashboards/dealer/CustomerInquiries').then(m => ({ default: m.CustomerInquiries })));
const TestDriveSchedule = React.lazy(() => import('@/dashboards/dealer/TestDriveSchedule').then(m => ({ default: m.TestDriveSchedule })));
const SalesProcessing = React.lazy(() => import('@/dashboards/dealer/SalesProcessing').then(m => ({ default: m.SalesProcessing })));
const EmployeeAssignment = React.lazy(() => import('@/dashboards/dealer/EmployeeAssignment').then(m => ({ default: m.EmployeeAssignment })));
const EmployeePerformance = React.lazy(() => import('@/dashboards/dealer/EmployeePerformance').then(m => ({ default: m.EmployeePerformance })));

// Employee dashboard + pages
const EmployeeDashboard = React.lazy(() => import('@/dashboards/employee/EmployeeDashboard').then(m => ({ default: m.EmployeeDashboard })));
const EmployeeInquiries = React.lazy(() => import('@/dashboards/employee/EmployeeInquiries').then(m => ({ default: m.EmployeeInquiries })));

// Manager dashboard + pages
const ManagerDashboard = React.lazy(() => import('@/dashboards/manager/ManagerDashboard').then(m => ({ default: m.ManagerDashboard })));
const TeamManagement = React.lazy(() => import('@/dashboards/manager/TeamManagement').then(m => ({ default: m.TeamManagement })));
const DealershipOperations = React.lazy(() => import('@/dashboards/manager/DealershipOperations').then(m => ({ default: m.DealershipOperations })));
const SalesReports = React.lazy(() => import('@/dashboards/manager/SalesReports').then(m => ({ default: m.SalesReports })));

// Admin dashboard + pages
const AdminDashboard = React.lazy(() => import('@/dashboards/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const MultiDealershipView = React.lazy(() => import('@/dashboards/admin/MultiDealershipView').then(m => ({ default: m.MultiDealershipView })));
const FinancialAnalytics = React.lazy(() => import('@/dashboards/admin/FinancialAnalytics').then(m => ({ default: m.FinancialAnalytics })));
const StrategicPlanning = React.lazy(() => import('@/dashboards/admin/StrategicPlanning').then(m => ({ default: m.StrategicPlanning })));
const UserManagement = React.lazy(() => import('@/dashboards/admin/UserManagement').then(m => ({ default: m.UserManagement })));

// Shared pages
const NotificationsPage = React.lazy(() => import('@/pages/shared/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ProfilePage = React.lazy(() => import('@/pages/shared/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = React.lazy(() => import('@/pages/shared/SettingsPage').then(m => ({ default: m.SettingsPage })));

// ── Suspense Fallback ───────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-96">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 animate-pulse">Loading…</p>
    </div>
  </div>
);

// ── Role-Based Route Guard ──────────────────────────────────────────────
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const isStaffRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dealer') || location.pathname.startsWith('/manager') || location.pathname.startsWith('/employee');
    return <Navigate to={isStaffRoute ? "/admin-login" : "/login"} replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user) {
      switch (user.role) {
        case UserRole.CUSTOMER:
          return <Navigate to="/customer" replace />;
        case UserRole.EMPLOYEE:
          return <Navigate to="/employee" replace />;
        case UserRole.DEALER:
          return <Navigate to="/dealer" replace />;
        case UserRole.MANAGER:
          return <Navigate to="/manager" replace />;
        case UserRole.ADMIN:
        case UserRole.ADMIN:
          return <Navigate to="/admin" replace />;
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
      case UserRole.EMPLOYEE:
        return <Navigate to="/employee" replace />;
      case UserRole.DEALER:
        return <Navigate to="/dealer" replace />;
      case UserRole.MANAGER:
        return <Navigate to="/manager" replace />;
      case UserRole.ADMIN:
      case UserRole.ADMIN:
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/alt" element={<LandingPage />} />

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

          {/* Dealer Routes - core pages inside MainLayout */}
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

          {/* Admin/admin Routes */}
          <Route
            path="/admin/*"
            element={
              <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.ADMIN]}>
                <Routes>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dealerships" element={<MultiDealershipView />} />
                  <Route path="financials" element={<FinancialAnalytics />} />
                  <Route path="strategy" element={<StrategicPlanning />} />
                  <Route path="users" element={<UserManagement />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee/*"
            element={
              <RoleGuard allowedRoles={[UserRole.EMPLOYEE]}>
                <Routes>
                  <Route index element={<EmployeeDashboard />} />
                  <Route path="inquiries" element={<EmployeeInquiries />} />
                </Routes>
              </RoleGuard>
            }
          />

          {/* Shared Routes */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>


        {/* Dealer standalone pages — full-screen (no MainLayout) */}
        <Route
          path="/dealer/assignments"
          element={
            <RoleGuard allowedRoles={[UserRole.DEALER]}>
              <EmployeeAssignment />
            </RoleGuard>
          }
        />
        <Route
          path="/dealer/performance"
          element={
            <RoleGuard allowedRoles={[UserRole.DEALER]}>
              <EmployeePerformance />
            </RoleGuard>
          }
        />

        {/* Catch all — send unknown routes to 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
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
