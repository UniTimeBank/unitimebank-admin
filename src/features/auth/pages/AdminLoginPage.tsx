import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useLoginMutation } from '@/core/api/auth/authApi';
import { useAppDispatch } from '@/core/store/hooks';
import { setCredentials } from '@/core/store/slices/authSlice';
import { ROUTES } from '@/routes/paths';
import toast from 'react-hot-toast';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Vui lòng nhập địa chỉ email quản trị viên');
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      const user = response.user;

      if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
        toast.error('Tài khoản của bạn không có quyền truy cập cổng Quản trị viên (Admin Portal).');
        return;
      }

      dispatch(
        setCredentials({
          user,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        }),
      );

      toast.success(`Chào mừng ${user.fullName || user.email} đã đăng nhập thành công!`);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    }
  };

  const handleQuickFill = (role: 'ADMIN' | 'MODERATOR') => {
    if (role === 'ADMIN') {
      setEmail('admin@gmail.com');
      setPassword('Admin@123456');
    } else {
      setEmail('moderator@gmail.com');
      setPassword('Moderator@123456');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative font-sans">
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-1">
            <img
              src="/Logo.png"
              alt="UniTime Bank Logo"
              className="w-28 h-28 object-contain drop-shadow-sm hover:scale-105 transition-transform"
            />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            UniTime<span className="text-teal-600">Bank</span> Quản Trị
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Cổng tiếp nhận báo cáo, kiểm duyệt khiếu nại & điều hành hệ thống
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Quản Trị Viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Mật Khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm tracking-wide shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Xác Thực & Đăng Nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Role Access Notice - 1 Single Clean Line */}
          <div className="mt-5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-600 whitespace-nowrap overflow-hidden">
            <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
            <p className="truncate text-xs">
              Chỉ dành cho tài khoản có vai trò <strong className="text-slate-900 font-bold">ADMIN</strong> hoặc <strong className="text-slate-900 font-bold">MODERATOR</strong>.
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-500 font-medium">
              Điền nhanh mẫu:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('ADMIN')}
                className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 transition-colors cursor-pointer"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('MODERATOR')}
                className="px-3 py-1.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                Moderator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
