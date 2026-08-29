import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES } from './paths';

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (isAuthenticated && user && (user.role === 'ADMIN' || user.role === 'MODERATOR')) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
