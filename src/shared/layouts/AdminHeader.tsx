import React from 'react';
import { useAppSelector, useAppDispatch } from '@/core/store/hooks';
import { logout } from '@/core/store/slices/authSlice';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/paths';

interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title = 'Tổng Quan Hệ Thống' }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-20">
      {/* Current Page Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-slate-900 tracking-tight">{title}</h1>
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-700 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Hệ thống trực tuyến</span>
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* User Card Pill */}
        <div className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="text-left leading-none pr-1">
            <div className="text-xs font-bold text-slate-900">
              {user?.fullName || user?.email.split('@')[0] || 'Admin'}
            </div>
            <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider">
              {user?.role || 'ADMIN'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
