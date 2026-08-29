import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Shield,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  useGetAccountsQuery,
  useUpdateAccountStatusMutation,
  useUpdateAccountRoleMutation,
  useAdminResetPasswordMutation,
} from '@/core/api/accounts/accountsApi';
import type { UserAccountItem, AccountRole, AccountStatus } from '../types';
import {
  ACCOUNT_ROLE_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
  ACCOUNT_ROLE_BADGES,
  ACCOUNT_STATUS_BADGES,
} from '../constants';
import {
  Badge,
  Select,
  Modal,
  LoadingSpinner,
  EmptyState,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/components';
import toast from 'react-hot-toast';

export const AccountsListPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals state
  const [roleModalUser, setRoleModalUser] = useState<UserAccountItem | null>(null);
  const [newRole, setNewRole] = useState<AccountRole>('USER');

  const [resetModalUser, setResetModalUser] = useState<UserAccountItem | null>(null);
  const [tempPassword, setTempPassword] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);

  // API hooks
  const {
    data: accountsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAccountsQuery({
    search: searchKeyword || undefined,
    role: selectedRole || undefined,
    status: selectedStatus || undefined,
    page: 1,
    limit: 50,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAccountStatusMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateAccountRoleMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useAdminResetPasswordMutation();

  const accounts = accountsData?.accounts || [];

  // Toggle Lock/Unlock
  const handleToggleStatus = async (account: UserAccountItem) => {
    const targetStatus: AccountStatus = account.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED';
    try {
      await updateStatus({ id: account.id, status: targetStatus }).unwrap();
      toast.success(
        targetStatus === 'LOCKED'
          ? `Đã khóa tài khoản ${account.email}!`
          : `Đã mở khóa tài khoản ${account.email}!`,
      );
    } catch (err: any) {
      toast.error(err?.data?.message || 'Không thể thay đổi trạng thái tài khoản');
    }
  };

  // Submit Role Change
  const handleSubmitRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleModalUser) return;
    try {
      await updateRole({ id: roleModalUser.id, role: newRole }).unwrap();
      toast.success(`Đã cập nhật quyền hạn của ${roleModalUser.email} thành ${newRole}!`);
      setRoleModalUser(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Không thể phân quyền tài khoản');
    }
  };

  // Submit Password Reset
  const handleSubmitPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalUser) return;
    if (!tempPassword.trim()) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return;
    }
    try {
      const res = await resetPassword({
        id: resetModalUser.id,
        newPassword: tempPassword.trim(),
      }).unwrap();
      toast.success(res.message || 'Đã đặt lại mật khẩu thành công!');
      setResetModalUser(null);
      setTempPassword('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Không thể đặt lại mật khẩu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-teal-600" />
            <span>Quản Trị Tài Khoản & Phân Quyền Hệ Thống</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý danh sách tài khoản sinh viên và cán bộ, phân quyền vai trò (Admin / Moderator / User) và khóa tài khoản vi phạm
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>Làm Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          {/* Role Filter */}
          <div className="w-56">
            <Select
              options={ACCOUNT_ROLE_OPTIONS}
              value={selectedRole}
              onChange={(val) => setSelectedRole(val)}
              size="sm"
            />
          </div>

          {/* Status Filter */}
          <div className="w-52">
            <Select
              options={ACCOUNT_STATUS_OPTIONS}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              size="sm"
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo email tài khoản..."
            className="w-full pl-10 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 transition-all"
          />
        </div>
      </div>

      {/* Accounts Table Container */}
      {isLoading ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 shadow-xs">
          <LoadingSpinner text="Đang tải danh sách tài khoản hệ thống..." />
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-8 shadow-xs">
          <EmptyState
            icon={UserCheck}
            title="Không tìm thấy tài khoản nào"
            description="Không có tài khoản nào phù hợp với bộ lọc tìm kiếm đã chọn."
          />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Tài Khoản Email</TableHead>
              <TableHead>Vai Trò / Quyền Hạn</TableHead>
              <TableHead>Trạng Thái</TableHead>
              <TableHead>Ngày Tạo</TableHead>
              <TableHead className="text-right">Thao Tác Quản Trị</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {accounts.map((acc) => {
              const roleBadge = ACCOUNT_ROLE_BADGES[acc.role] || {
                label: acc.role,
                variant: 'slate',
              };
              const statusBadge = ACCOUNT_STATUS_BADGES[acc.status] || {
                label: acc.status,
                variant: 'slate',
              };
              const isLocked = acc.status === 'LOCKED';

              return (
                <TableRow key={acc.id}>
                  <TableCell>
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span>{acc.email}</span>
                      {acc.role === 'ADMIN' && (
                        <span className="px-1.5 py-0.5 rounded-sm bg-purple-100 text-purple-700 text-[10px] font-bold">
                          ROOT
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {acc.id.substring(0, 12)}...
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={statusBadge.variant} pulse={acc.status === 'PENDING_VERIFY'}>
                      {statusBadge.label}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-400 text-[11px] whitespace-nowrap">
                    {new Date(acc.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {/* Change Role Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setRoleModalUser(acc);
                          setNewRole(acc.role);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Đổi vai trò / phân quyền"
                      >
                        <Shield className="w-3.5 h-3.5 text-teal-600" />
                        <span>Phân Quyền</span>
                      </button>

                      {/* Reset Password Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setResetModalUser(acc);
                          setTempPassword('');
                          setShowTempPassword(false);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Đặt lại mật khẩu"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>

                      {/* Lock / Unlock Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(acc)}
                        disabled={isUpdatingStatus}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                          isLocked
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                        title={isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                      >
                        {isLocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mở Khóa</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                            <span>Khóa</span>
                          </>
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Role Assignment Modal */}
      <Modal
        isOpen={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
        title="Phân quyền tài khoản"
        maxWidth="md"
      >
        {roleModalUser && (
          <form onSubmit={handleSubmitRoleChange} className="space-y-4">
            {/* Clean User Info Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-500">Tài khoản:</span>{' '}
                <span className="font-semibold text-slate-900">{roleModalUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Hiện tại:</span>
                <Badge variant={ACCOUNT_ROLE_BADGES[roleModalUser.role].variant}>
                  {ACCOUNT_ROLE_BADGES[roleModalUser.role].label}
                </Badge>
              </div>
            </div>

            {/* Role Select */}
            <div>
              <Select
                label="Vai trò mới"
                options={[
                  { value: 'USER', label: 'Sinh viên / Người dùng (USER)' },
                  { value: 'MODERATOR', label: 'Kiểm duyệt viên (MODERATOR)' },
                  { value: 'ADMIN', label: 'Quản trị viên (ADMIN)' },
                ]}
                value={newRole}
                onChange={(val) => setNewRole(val as AccountRole)}
              />
            </div>

            {/* Subtle Tip */}
            <p className="text-[11.5px] text-slate-500 pt-0.5 truncate">
              * Quyền <strong className="text-slate-700 font-semibold">ADMIN/MODERATOR</strong> cho phép đăng nhập vào cổng Quản trị.
            </p>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRoleModalUser(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isUpdatingRole}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isUpdatingRole ? 'Đang lưu...' : 'Lưu phân quyền'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={!!resetModalUser}
        onClose={() => {
          setResetModalUser(null);
          setTempPassword('');
        }}
        title="Đặt lại mật khẩu"
        maxWidth="md"
      >
        {resetModalUser && (
          <form onSubmit={handleSubmitPasswordReset} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-slate-500">Tài khoản:</span>
              <span className="font-semibold text-slate-900">{resetModalUser.email}</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Mật khẩu mới
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const randomPwd = 'UniTime@' + Math.floor(100000 + Math.random() * 900000);
                    setTempPassword(randomPwd);
                    setShowTempPassword(true);
                  }}
                  className="text-[11px] font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                >
                  + Tạo mật khẩu ngẫu nhiên
                </button>
              </div>

              <div className="relative">
                <input
                  type={showTempPassword ? 'text' : 'password'}
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                  required
                  minLength={6}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowTempPassword(!showTempPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showTempPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showTempPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11.5px] text-slate-500 pt-0.5 truncate">
              * Mật khẩu mới có hiệu lực ngay sau khi xác nhận.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setResetModalUser(null);
                  setTempPassword('');
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isResettingPassword || !tempPassword.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isResettingPassword ? 'Đang đổi...' : 'Xác nhận đổi mật khẩu'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
