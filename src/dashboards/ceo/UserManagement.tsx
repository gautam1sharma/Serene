import React, { useState } from 'react';
import { Search, UserPlus, MoreHorizontal } from 'lucide-react';
import { mockUsers } from '@/data/mockData';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      customer: 'bg-blue-100 text-blue-700',
      dealer: 'bg-green-100 text-green-700',
      manager: 'bg-purple-100 text-purple-700',
      ceo: 'bg-orange-100 text-orange-700',
      admin: 'bg-red-100 text-red-700'
    };
    return styles[role];
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700'
    };
    return styles[status as keyof typeof styles] || styles.inactive;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage all system users</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
          <UserPlus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Roles</option>
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                        alt={user.firstName}
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium capitalize",
                      getRoleBadge(user.role)
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium capitalize",
                      getStatusBadge(user.status)
                    )}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
