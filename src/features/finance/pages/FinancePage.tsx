import React from 'react';
import {
  Lock,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  CheckCircle2,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { StatCard } from '@/shared/components/StatCard';
import { Badge, type BadgeVariant } from '@/shared/components/Badge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import {
  useGetFinanceStatsQuery,
  useGetFinanceLedgerQuery,
} from '@/core/api/finance/financeApi';
import type { LedgerEntryType } from '@/features/finance/types';

const entryTypeBadgeMap: Record<LedgerEntryType, { label: string; variant: BadgeVariant }> = {
  ESCROW_RELEASE: { label: 'Giải Ngân Ký Quỹ', variant: 'success' },
  ESCROW_HOLD: { label: 'Tạm Giữ Ký Quỹ', variant: 'warning' },
  CANCELLATION_REFUND: { label: 'Hoàn Tiền Hủy Lịch', variant: 'danger' },
  METERING_CHARGE: { label: 'Phí Lớp Học Nhóm', variant: 'primary' },
  ONBOARDING_REWARD: { label: 'Thưởng Đăng Ký', variant: 'purple' },
  DAILY_CHECKIN_REWARD: { label: 'Thưởng Điểm Danh', variant: 'primary' },
  TRUST_SCORE_BONUS: { label: 'Thưởng Điểm Uy Tín', variant: 'success' },
  ADMIN_ADJUSTMENT: { label: 'Điều Chỉnh Quản Trị', variant: 'slate' },
};

export const FinancePage: React.FC = () => {
  const {
    data: stats,
    isLoading: isLoadingStats,
    isFetching: isFetchingStats,
    refetch: refetchStats,
  } = useGetFinanceStatsQuery();

  const {
    data: ledgerData,
    isLoading: isLoadingLedger,
    isFetching: isFetchingLedger,
    refetch: refetchLedger,
  } = useGetFinanceLedgerQuery({ page: 1, limit: 50 });

  const handleRefresh = () => {
    refetchStats();
    refetchLedger();
  };

  const isRefreshing = isFetchingStats || isFetchingLedger;
  const entries = ledgerData?.entries || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-teal-600" />
            <span>Quản Trị Ví Credit & Sổ Cái Bất Biến (Ledger)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Giám sát dòng lưu chuyển Credit thực tế, quỹ ký quỹ Escrow và tính toàn vẹn của sổ cái giao dịch
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Đồng Bộ Dữ Liệu</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Đang Ký Quỹ (Escrow Hold)"
          value={`${(stats?.totalEscrowHeld ?? 0).toLocaleString()} Credit`}
          subtitle="Đang tạm giữ cho các buổi học"
          icon={Lock}
          colorScheme="amber"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Đã Giải Ngân Thành Công"
          value={`${(stats?.totalCompletedTransfers ?? 0).toLocaleString()} Credit`}
          subtitle="Đã chuyển tới ví Mentor"
          icon={ArrowUpRight}
          colorScheme="emerald"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Đã Hoàn Trả (Refunded)"
          value={`${(stats?.totalRefunded ?? 0).toLocaleString()} Credit`}
          subtitle="Do hủy lịch hoặc hết hạn duyệt"
          icon={ArrowDownLeft}
          colorScheme="rose"
          isLoading={isLoadingStats}
        />

        <StatCard
          title="Tổng Credit Lưu Thông"
          value={`${(stats?.systemCirculation ?? 0).toLocaleString()} Credit`}
          subtitle="Toàn bộ hệ thống sinh viên"
          icon={DollarSign}
          colorScheme="teal"
          isLoading={isLoadingStats}
        />
      </div>

      {/* Immutable Ledger Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Nhật Ký Giao Dịch Sổ Cái Thực Tế
            </h3>
            <p className="text-xs text-slate-500">
              Tổng cộng {ledgerData?.pagination?.total ?? entries.length} bản ghi theo cơ chế Atomic Ledger bất biến
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[11px] font-semibold text-teal-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Audit Verified</span>
          </div>
        </div>

        {isLoadingLedger ? (
          <LoadingSpinner text="Đang tải dữ liệu sổ cái giao dịch..." />
        ) : entries.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Chưa có giao dịch sổ cái nào"
            description="Hệ thống sẽ tự động ghi nhận các biến động khi sinh viên hoàn thành buổi học hoặc nhận thưởng."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Mã Bản Ghi</th>
                  <th className="py-3 px-4">Loại Giao Dịch</th>
                  <th className="py-3 px-4">Số Lượng</th>
                  <th className="py-3 px-4">Số Dư Sau</th>
                  <th className="py-3 px-4">Mã Người Dùng</th>
                  <th className="py-3 px-4">Tham Chiếu</th>
                  <th className="py-3 px-4">Thời Gian Ghi Nhận</th>
                  <th className="py-3 px-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal">
                {entries.map((tx) => {
                  const meta = entryTypeBadgeMap[tx.entryType] || {
                    label: tx.entryType,
                    variant: 'slate',
                  };
                  const isCredit = tx.direction === 'CREDIT';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        #{tx.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </td>
                      <td
                        className={`py-3.5 px-4 font-bold tabular-nums ${
                          isCredit ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isCredit ? `+${tx.amount}` : `-${tx.amount}`} Credit
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 tabular-nums">
                        {tx.balanceAfter} Credit
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {tx.userId ? `${tx.userId.substring(0, 10)}...` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate" title={tx.referenceId}>
                        {tx.referenceKind ? `[${tx.referenceKind}] ` : ''}
                        {tx.referenceId ? `${tx.referenceId.substring(0, 12)}...` : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Badge variant="success">Hoàn Tất</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
