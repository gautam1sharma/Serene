import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Calendar, 
  ShoppingCart, 
  MessageSquare, 
  Package, 
  Users, 
  BarChart3, 
  Building2, 
  TrendingUp, 
  Target, 
  Settings,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, Permission } from '@/types';
import { hasPermission } from '@/utils/permissions';
import { cn } from '@/lib/utils';
import logoBlack from '@/assets/default-monochrome-black.svg';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  permissions?: Permission[];
  roles?: UserRole[];
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Define navigation items based on roles
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { label: 'Dashboard', path: getDashboardPath(), icon: LayoutDashboard }
    ];

    // Customer-specific items
    if (user.role === UserRole.CUSTOMER) {
      return [
        ...baseItems,
        { label: 'Browse Cars', path: '/customer/cars', icon: Car },
        { label: 'My Test Drives', path: '/customer/test-drives', icon: Calendar },
        { label: 'My Orders', path: '/customer/orders', icon: ShoppingCart },
        { label: 'My Inquiries', path: '/customer/inquiries', icon: MessageSquare }
      ];
    }

    // Dealer-specific items
    if (user.role === UserRole.DEALER) {
      return [
        ...baseItems,
        { 
          label: 'Inventory', 
          path: '/dealer/inventory', 
          icon: Package,
          permissions: [Permission.MANAGE_INVENTORY]
        },
        { 
          label: 'Inquiries', 
          path: '/dealer/inquiries', 
          icon: MessageSquare,
          permissions: [Permission.HANDLE_INQUIRIES]
        },
        { 
          label: 'Test Drives', 
          path: '/dealer/test-drives', 
          icon: Calendar,
          permissions: [Permission.SCHEDULE_TEST_DRIVES]
        },
        { 
          label: 'Sales', 
          path: '/dealer/sales', 
          icon: ShoppingCart,
          permissions: [Permission.PROCESS_SALES]
        }
      ];
    }

    // Manager-specific items
    if (user.role === UserRole.MANAGER) {
      return [
        ...baseItems,
        { 
          label: 'Team Management', 
          path: '/manager/team', 
          icon: Users,
          permissions: [Permission.MANAGE_DEALERS]
        },
        { 
          label: 'Operations', 
          path: '/manager/operations', 
          icon: Building2,
          permissions: [Permission.MANAGE_OPERATIONS]
        },
        { 
          label: 'Reports', 
          path: '/manager/reports', 
          icon: BarChart3,
          permissions: [Permission.VIEW_REPORTS]
        }
      ];
    }

    // CEO/Admin items
    if (user.role === UserRole.CEO || user.role === UserRole.ADMIN) {
      return [
        ...baseItems,
        { 
          label: 'Dealerships', 
          path: '/ceo/dealerships', 
          icon: Building2,
          permissions: [Permission.VIEW_ALL_DEALERSHIPS]
        },
        { 
          label: 'Financials', 
          path: '/ceo/financials', 
          icon: TrendingUp,
          permissions: [Permission.VIEW_FINANCIALS]
        },
        { 
          label: 'Strategy', 
          path: '/ceo/strategy', 
          icon: Target,
          permissions: [Permission.STRATEGIC_DECISIONS]
        },
        { 
          label: 'Users', 
          path: '/ceo/users', 
          icon: Users,
          permissions: [Permission.USER_MANAGEMENT]
        }
      ];
    }

    return baseItems;
  };

  const getDashboardPath = () => {
    switch (user.role) {
      case UserRole.CUSTOMER:
        return '/customer';
      case UserRole.DEALER:
        return '/dealer';
      case UserRole.MANAGER:
        return '/manager';
      case UserRole.CEO:
      case UserRole.ADMIN:
        return '/ceo';
      default:
        return '/';
    }
  };

  const navItems = getNavItems();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col transform",
        collapsed ? "max-md:-translate-x-full md:w-20" : "translate-x-0 w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex justify-center items-center w-full">
          {!collapsed ? (
            <div className="flex flex-col items-start w-full">
              <img src={logoBlack} alt="Serene" className="h-8 mb-1" />
              <p className="text-xs text-gray-500 font-medium">Dealership System</p>
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#1a2a44] rounded-xl flex items-center justify-center flex-shrink-0">
               {/* Keep the icon for collapsed state since the wordmark will be unreadable */}
               <span className="material-symbols-outlined text-xl text-white">directions_car</span>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            // Check permissions
            if (item.permissions && !item.permissions.some(p => hasPermission(user, p))) {
              return null;
            }

            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    active 
                      ? "bg-slate-100 text-[#1a2a44]" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    active ? "text-[#1a2a44]" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  
                  {!collapsed && (
                    <>
                      <span className="font-medium text-sm flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Common Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className={cn("text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3", collapsed && "text-center")}>
            {!collapsed && 'Account'}
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/notifications"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive('/notifications')
                    ? "bg-slate-100 text-[#1a2a44]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Bell className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                {!collapsed && <span className="font-medium text-sm">Notifications</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive('/profile')
                    ? "bg-slate-100 text-[#1a2a44]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <User className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                {!collapsed && <span className="font-medium text-sm">Profile</span>}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive('/settings')
                    ? "bg-slate-100 text-[#1a2a44]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                {!collapsed && <span className="font-medium text-sm">Settings</span>}
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          "flex items-center gap-3",
          collapsed && "justify-center"
        )}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
            alt={user.firstName}
            className="w-10 h-10 rounded-full bg-gray-100"
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {user.role}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
