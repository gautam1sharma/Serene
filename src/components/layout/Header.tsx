import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  ChevronDown,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    const [notificationsRes, countRes] = await Promise.all([
      notificationService.getNotifications(user.id, { limit: 5 }),
      notificationService.getUnreadCount(user.id)
    ]);

    if (notificationsRes.success && notificationsRes.data) {
      setNotifications(notificationsRes.data);
    }

    if (countRes.success && countRes.data !== undefined) {
      setUnreadCount(countRes.data);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const res = await notificationService.markAsRead(notificationId);
    if (res.success) {
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.id);
    loadNotifications();
  };

  if (!user) return null;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search cars, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                        !notification.read && "bg-blue-50/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          !notification.read ? "bg-blue-500" : "bg-transparent"
                        )} />
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                alt={user.firstName}
                className="w-8 h-8 rounded-full bg-gray-100"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Click outside to close notifications */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};
