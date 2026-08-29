import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLoginPage } from '@/features/auth/pages/AdminLoginPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { UsersListPage } from '@/features/users/pages/UsersListPage';
import { AccountsListPage } from '@/features/accounts/pages/AccountsListPage';
import { SessionsMonitorPage } from '@/features/sessions/pages/SessionsMonitorPage';
import { FinancePage } from '@/features/finance/pages/FinancePage';
import { AdminLayout } from '@/shared/layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { ROUTES } from './paths';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Route công khai - Login */}
      <Route
        path={ROUTES.AUTH.LOGIN}
        element={
          <PublicRoute>
            <AdminLoginPage />
          </PublicRoute>
        }
      />

      {/* Redirect gốc về /dashboard */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      {/* Các tuyến đường được bảo vệ bởi AdminLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
        <Route path={ROUTES.USERS} element={<UsersListPage />} />
        {/* Module Quản lý Tài khoản & Phân quyền - Chỉ ADMIN */}
        <Route
          path={ROUTES.ACCOUNTS}
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AccountsListPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.SESSIONS} element={<SessionsMonitorPage />} />
        {/* Module Tài chính & Escrow - Chỉ ADMIN */}
        <Route
          path={ROUTES.FINANCE}
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <FinancePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Tuyến đường không hợp lệ */}
      <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  );
};
