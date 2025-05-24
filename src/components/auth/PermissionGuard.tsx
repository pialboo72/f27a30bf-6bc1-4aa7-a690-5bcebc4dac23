
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from 'lucide-react';

export type Role = 'admin' | 'manager' | 'user';
export type Permission = 'view_all' | 'edit_all' | 'delete_all' | 'manage_users' | 'view_own' | 'edit_own';

interface PermissionGuardProps {
  requiredRole?: Role;
  requiredPermission?: Permission;
  userRole?: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const rolePermissions: Record<Role, Permission[]> = {
  admin: ['view_all', 'edit_all', 'delete_all', 'manage_users', 'view_own', 'edit_own'],
  manager: ['view_all', 'edit_all', 'view_own', 'edit_own'],
  user: ['view_own', 'edit_own']
};

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredRole,
  requiredPermission,
  userRole = 'user', // 預設為 user 角色
  children,
  fallback
}) => {
  const userPermissions = rolePermissions[userRole] || [];

  const hasRoleAccess = !requiredRole || userRole === requiredRole || 
    (requiredRole === 'user' && ['admin', 'manager'].includes(userRole)) ||
    (requiredRole === 'manager' && userRole === 'admin');

  const hasPermissionAccess = !requiredPermission || 
    userPermissions.includes(requiredPermission);

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Alert className="border-red-200 bg-red-50">
        <ShieldAlert className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          您沒有權限訪問此功能。請聯繫管理員獲取相應權限。
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
