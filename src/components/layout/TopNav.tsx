import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User, Settings, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { notificationService } from '@/services/notificationService';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logoBlack from '@/assets/default-monochrome-black.svg';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItem { label: string; path: string; }

// ─── Per-role nav items ───────────────────────────────────────────────────────
function getNavItems(role: UserRole | undefined): NavItem[] {
  switch (role) {
    case UserRole.CUSTOMER:
      return [
        { label: 'Dashboard', path: '/customer' },
        { label: 'Showroom',  path: '/cars' },
        { label: 'Test Drives', path: '/customer/test-drives' },
        { label: 'Orders',    path: '/customer/orders' },
        { label: 'Inquiries', path: '/customer/inquiries' },
      ];
    case UserRole.DEALER:
      return [
        { label: 'Dashboard',  path: '/dealer' },
        { label: 'Inventory',  path: '/dealer/inventory' },
        { label: 'Inquiries',  path: '/dealer/inquiries' },
        { label: 'Test Drives', path: '/dealer/test-drives' },
        { label: 'Sales',      path: '/dealer/sales' },
      ];
    case UserRole.MANAGER:
      return [
        { label: 'Dashboard',   path: '/manager' },
        { label: 'Team',        path: '/manager/team' },
        { label: 'Operations',  path: '/manager/operations' },
        { label: 'Reports',     path: '/manager/reports' },
      ];
    case UserRole.CEO:
    case UserRole.ADMIN:
      return [
        { label: 'Dashboard',   path: '/ceo' },
        { label: 'Dealerships', path: '/ceo/dealerships' },
        { label: 'Financials',  path: '/ceo/financials' },
        { label: 'Strategy',    path: '/ceo/strategy' },
        { label: 'Users',       path: '/ceo/users' },
      ];
    default:
      return [
        { label: 'Showroom',    path: '/cars' },
        { label: 'About',       path: '/about' },
        { label: 'Dealerships', path: '/dealerships' },
        { label: 'Support',     path: '/support' },
      ];
  }
}

function getRoleLabel(role: UserRole | undefined): string {
  switch (role) {
    case UserRole.CUSTOMER: return 'Premium Member';
    case UserRole.DEALER:   return 'Sales Advisor';
    case UserRole.MANAGER:  return 'Manager';
    case UserRole.CEO:      return 'Chief Executive';
    case UserRole.ADMIN:    return 'Administrator';
    default:                return '';
  }
}

// ─── TopNav ───────────────────────────────────────────────────────────────────
export const TopNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen]   = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const navItems = getNavItems(user?.role);

  // Load notification count
  useEffect(() => {
    if (!user) return;
    notificationService.getUnreadCount(user.id).then(res => {
      if (res.success && res.data !== undefined) setUnreadCount(res.data);
    });
  }, [user]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile drawer on navigation
  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      {/* ═══ MAIN HEADER ═══════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">

          {/* ── Logo / Wordmark ─────────────────────────────────────── */}
          <Link to={user ? '/dashboard' : '/'} className="flex-shrink-0 flex items-center">
            <img src={logoBlack} alt="Serene" className="h-7" />
          </Link>

          {/* ── Desktop Nav Links ────────────────────────────────────── */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-widest font-medium text-gray-500">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/customer' || item.path === '/dealer' || item.path === '/manager' || item.path === '/ceo'}
                className={({ isActive }) =>
                  cn(
                    'transition-colors hover:text-serene-matte relative py-1',
                    isActive
                      ? 'text-serene-matte after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-serene-matte after:rounded-full'
                      : ''
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right cluster ────────────────────────────────────────── */}
          <div className="hidden md:flex items-center space-x-3">

            {/* Vertical divider */}
            <div className="h-6 w-px bg-gray-200" />

            {/* Search icon / inline input */}
            <div className="relative flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 bg-white shadow-sm">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }
                      if (e.key === 'Escape') setSearchOpen(false);
                    }}
                    placeholder="Search cars…"
                    className="w-44 text-xs outline-none bg-transparent text-serene-matte placeholder:text-gray-400"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="text-gray-400 hover:text-serene-matte transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-400 hover:text-serene-matte transition-colors"
                  aria-label="Open search"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Notification bell — only when logged in */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative p-2 text-gray-400 hover:text-serene-matte transition-colors" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-semibold rounded-full flex items-center justify-center px-1">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-0 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-semibold text-sm text-serene-matte">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red-50 text-red-600 font-semibold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="px-4 py-6 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                    <p className="text-xs text-gray-400">No new notifications</p>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2.5">
                    <Link to="/notifications" className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 hover:text-serene-matte transition-colors">
                      View All
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User profile / auth buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-3 cursor-pointer group" aria-label="User menu">
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-semibold uppercase tracking-tighter text-serene-matte leading-tight">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-gray-400">{getRoleLabel(user.role)}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-serene-silver flex items-center justify-center overflow-hidden border border-gray-200 group-hover:border-serene-brushed transition-colors flex-shrink-0">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                        alt={user.firstName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="font-semibold text-xs text-serene-matte uppercase tracking-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer text-sm">
                      <User className="w-4 h-4 mr-2 text-gray-400" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer text-sm">
                      <Settings className="w-4 h-4 mr-2 text-gray-400" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 text-sm">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-[11px] uppercase tracking-widest font-medium text-gray-500 hover:text-serene-matte transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 bg-serene-matte text-white text-[11px] uppercase tracking-widest font-semibold rounded-full hover:bg-gray-800 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile hamburger ─────────────────────────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-serene-matte transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </header>

      {/* ═══ MOBILE DRAWER ═════════════════════════════════════════════════ */}
      <div
        className={cn(
          'md:hidden fixed inset-x-0 top-20 z-40 bg-white border-b border-gray-100 shadow-lg transition-all duration-300 overflow-hidden',
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <nav className="px-6 py-6 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  'block py-3 text-xs uppercase tracking-widest font-medium border-b border-gray-50 transition-colors',
                  isActive ? 'text-serene-matte' : 'text-gray-500 hover:text-serene-matte'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user && (
            <>
              <NavLink to="/notifications" onClick={handleNavClick} className="block py-3 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-serene-matte border-b border-gray-50 transition-colors">
                Notifications {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
              </NavLink>
              <NavLink to="/profile" onClick={handleNavClick} className="block py-3 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-serene-matte border-b border-gray-50 transition-colors">
                Profile
              </NavLink>
              <NavLink to="/settings" onClick={handleNavClick} className="block py-3 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-serene-matte transition-colors">
                Settings
              </NavLink>

              <div className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full border border-gray-200"
                  />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-tight text-serene-matte">{user.firstName} {user.lastName}</p>
                    <p className="text-[10px] text-gray-400">{getRoleLabel(user.role)}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); handleNavClick(); }}
                  className="w-full py-3 bg-serene-matte text-white text-[10px] uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="pt-4 flex gap-3">
              <Link to="/login" onClick={handleNavClick} className="flex-1 text-center py-3 border border-serene-matte text-serene-matte text-[10px] uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Sign In
              </Link>
              <Link to="/register" onClick={handleNavClick} className="flex-1 text-center py-3 bg-serene-matte text-white text-[10px] uppercase tracking-widest font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/20 top-20" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};
