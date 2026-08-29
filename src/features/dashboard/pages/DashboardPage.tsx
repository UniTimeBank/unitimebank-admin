import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Video,
  Wallet,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { StatCard } from '@/shared/components/StatCard';
import { Badge } from '@/shared/components/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetReportsQuery } from '@/core/api/moderation/moderationApi';
import { useGetActiveRoomsQuery } from '@/core/api/analytics/analyticsApi';
import { useGetUsersQuery } from '@/core/api/users/usersApi';
import { useGetFinanceStatsQuery } from '@/core/api/finance/financeApi';
import { useAppSelector } from '@/core/store/hooks';
import { ROUTES } from '@/routes/paths';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'ADMIN';

  const { data: reportsData, isLoading: isReportsLoading } = useGetReportsQuery({
    status: 'PENDING',
    limit: 5,
  });

  const { data: activeRoomsData, isLoading: isRoomsLoading } = useGetActiveRoomsQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({ limit: 1 });
  const { data: financeStats, isLoading: isFinanceLoading } = useGetFinanceStatsQuery(undefined, {
    skip: !isAdmin,
  });

  const pendingReports = reportsData?.reports || [];
  const pendingTotal = reportsData?.total || 0;
  const activeRooms = activeRoomsData?.rooms || [];
  const totalUsers = usersData?.total || 0;
  const totalEscrowHeld = financeStats?.totalEscrowHeld || 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-800 to-teal-700 p-6 lg:p-7 text-white shadow-xs">
        <div className="max-w-2xl">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold mb-2.5">
            Bảng điều khiển quản trị
          </span>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
            Tổng quan hệ thống UniTime Bank
          </h2>
          <p className="mt-1.5 text-xs text-teal-100 leading-relaxed">
            Giám sát các hoạt động trao đổi kiến thức, xử lý khiếu nại báo cáo vi phạm và điều hành dòng chảy thời gian sinh viên.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Báo Cáo Chờ Xử Lý"
          value={isReportsLoading ? '...' : pendingTotal}
          subtitle={pendingTotal > 0 ? 'Cần ban kiểm duyệt xem xét' : 'Không có tồn đọng'}
          icon={ShieldAlert}
          colorScheme="rose"
          onClick={() => navigate(ROUTES.REPORTS)}
          isLoading={isReportsLoading}
        />

        <StatCard
          title="Phòng Học LiveKit Đang Mở"
          value={isRoomsLoading ? '...' : activeRooms.length}
          subtitle="Các lớp 1:1 và lớp nhóm đang diễn ra"
          icon={Video}
          colorScheme="teal"
          onClick={() => navigate(ROUTES.SESSIONS)}
          isLoading={isRoomsLoading}
        />

        <StatCard
          title="Thành Viên Hệ Thống"
          value={isUsersLoading ? '...' : totalUsers.toLocaleString()}
          subtitle="Sinh viên đã kích hoạt tài khoản"
          icon={Users}
          colorScheme="indigo"
          onClick={() => navigate(ROUTES.USERS)}
          isLoading={isUsersLoading}
        />

        {isAdmin ? (
          <StatCard
            title="Credit Đang Ký Quỹ (Escrow)"
            value={isFinanceLoading ? '...' : `${totalEscrowHeld.toLocaleString()} Credit`}
            subtitle="Tương đương các phút học được bảo đảm"
            icon={Wallet}
            colorScheme="emerald"
            onClick={() => navigate(ROUTES.FINANCE)}
            isLoading={isFinanceLoading}
          />
        ) : (
          <StatCard
            title="Quyền Hạn Kiểm Duyệt"
            value="MODERATOR"
            subtitle="Quyền kiểm duyệt & xử lý vi phạm"
            icon={ShieldAlert}
            colorScheme="amber"
          />
        )}
      </div>

      {/* Two Column Section: Pending Reports & Live Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pending Reports Widget */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Báo Cáo Vi Phạm Mới Nhất
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigate(ROUTES.REPORTS)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Xem tất cả ({pendingTotal})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {isReportsLoading ? (
                <LoadingSpinner size="sm" />
              ) : pendingReports.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
                  <p>Tuyệt vời! Hiện không có báo cáo vi phạm nào đang chờ xử lý.</p>
                </div>
              ) : (
                pendingReports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => navigate(ROUTES.REPORTS)}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-teal-300 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="overflow-hidden mr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">
                          #{report.id.substring(0, 8)}
                        </span>
                        <Badge variant="danger">{report.category}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-1">
                        {report.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Live Group Rooms Widget */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Phòng Học Nhóm Đang Hoạt Động
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigate(ROUTES.SESSIONS)}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Giám sát</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {isRoomsLoading ? (
                <LoadingSpinner size="sm" />
              ) : activeRooms.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <Video className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                  <p>Hiện chưa có phòng học nhóm nào đang mở trực tuyến.</p>
                </div>
              ) : (
                activeRooms.map((room) => (
                  <div
                    key={room.roomId}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
                  >
                    <div className="overflow-hidden mr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">{room.title}</span>
                        {room.category && <Badge variant="primary">{room.category}</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mã phòng: <span className="font-mono">{room.roomId.substring(0, 8)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="success" pulse>
                        {room.currentParticipants}/{room.maxParticipants || 20} học viên
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
