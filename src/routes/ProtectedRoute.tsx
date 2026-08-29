import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES } from './paths';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('ADMIN' | 'MODERATOR')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
  }

  // Bắt buộc role phải là ADMIN hoặc MODERATOR
  if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  // Nếu route có yêu cầu danh sách quyền cụ thể (ví dụ chỉ ADMIN)
  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
