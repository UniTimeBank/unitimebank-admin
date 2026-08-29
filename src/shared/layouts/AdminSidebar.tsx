import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  UserCheck,
  Video,
  Wallet,
  ChevronLeft,
} from 'lucide-react';
import { ROUTES } from '@/routes/paths';
import { useGetReportsQuery } from '@/core/api/moderation/moderationApi';
import { useAppSelector } from '@/core/store/hooks';

const navItems = [
  {
    name: 'Tổng Quan',
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    name: 'Báo Cáo Vi Phạm',
    path: ROUTES.REPORTS,
    icon: ShieldAlert,
    badgeCountKey: 'pendingReports',
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    name: 'Người Dùng & Uy Tín',
    path: ROUTES.USERS,
    icon: Users,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    name: 'Quản Lý Tài Khoản',
    path: ROUTES.ACCOUNTS,
    icon: UserCheck,
    roles: ['ADMIN'], // Chỉ ADMIN mới quản lý tài khoản & phân quyền
  },
  {
    name: 'Phòng Học Trực Tiếp',
    path: ROUTES.SESSIONS,
    icon: Video,
    roles: ['ADMIN', 'MODERATOR'],
  },
  {
    name: 'Tài Chính & Ký Quỹ',
    path: ROUTES.FINANCE,
    icon: Wallet,
    roles: ['ADMIN'],
  },
];

export const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { data: reportsData } = useGetReportsQuery({ status: 'PENDING', limit: 1 });
  const pendingCount = reportsData?.total || 0;

  const visibleNavItems = navItems.filter((item) =>
    item.roles ? item.roles.includes(user?.role as any) : true,
  );

  return (
    <aside
      className={`relative flex flex-col justify-between bg-white border-r border-slate-200 transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div
          className={`h-16 flex items-center border-b border-slate-100 transition-all ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          {collapsed ? (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1 shadow-xs hover:border-teal-400 transition-all cursor-pointer"
              title="Mở rộng thanh điều hướng"
            >
              <img src="/Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <img src="/Logo.png" alt="Logo" className="w-9 h-9 object-contain shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm text-slate-900 leading-tight truncate">
                    UniTime<span className="text-teal-600">Bank</span>
                  </span>
                  <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider">
                    Admin Portal
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                title="Thu gọn thanh điều hướng"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-2.5 space-y-1 mt-2">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                  collapsed ? 'justify-center px-2' : 'px-3.5'
                } ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold border-l-4 border-teal-600 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}

              {item.badgeCountKey === 'pendingReports' && pendingCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white ${
                    collapsed ? 'absolute top-1.5 right-1.5' : 'ml-auto'
                  }`}
                >
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3.5 border-t border-slate-100 text-center bg-slate-50/50">
        {!collapsed ? (
          <div className="text-[11px] text-slate-400 font-medium">
            UniTime Bank Core <span className="text-teal-600 font-bold">v1.0.0</span>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-slate-400">v1.0</span>
        )}
      </div>
    </aside>
  );
};
