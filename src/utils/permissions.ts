import type { User } from '@/types';
import { Permission, ROLE_PERMISSIONS } from '@/types';

/**
 * Check if a user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  
  // Check explicit user permissions
  if (user.permissions?.includes(permission)) return true;
  
  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  return rolePermissions?.includes(permission) ?? false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
}

/**
 * Get all permissions for a user (explicit + role-based)
 */
export function getAllPermissions(user: User | null): Permission[] {
  if (!user) return [];
  
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const explicitPermissions = user.permissions || [];
  
  // Combine and remove duplicates
  return Array.from(new Set([...rolePermissions, ...explicitPermissions]));
}

/**
 * Require permission - throws error if user doesn't have permission
 */
export function requirePermission(user: User | null, permission: Permission): void {
  if (!hasPermission(user, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}

/**
 * Filter navigation items based on user permissions
 */
export function filterNavItems<T extends { permissions?: Permission[] }>(
  items: T[],
  user: User | null
): T[] {
  return items.filter(item => {
    if (!item.permissions || item.permissions.length === 0) return true;
    return hasAnyPermission(user, item.permissions);
  });
}
