import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ROUTES } from '@/routes/paths';

const pageTitles: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Tổng Quan Hệ Thống',
  [ROUTES.REPORTS]: 'Trung Tâm Xử Lý Báo Cáo Vi Phạm',
  [ROUTES.USERS]: 'Quản Lý Người Dùng & Uy Tín',
  [ROUTES.SESSIONS]: 'Giám Sát Phòng Học Trực Tiếp',
  [ROUTES.FINANCE]: 'Tài Chính & Ký Quỹ Escrow',
};

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || 'Trang Quản Trị';

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader title={currentTitle} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
