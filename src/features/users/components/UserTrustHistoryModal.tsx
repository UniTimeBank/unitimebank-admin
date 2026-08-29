import React from 'react';
import { Modal } from '@/shared/components/Modal';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { EmptyState } from '@/shared/components/EmptyState';
import { useGetUserTrustScoreHistoryQuery } from '@/core/api/moderation/moderationApi';
import type { UserProfileDto } from '@/features/users/types';
import type { TrustScoreHistoryItem } from '@/features/reports/types';
import { Shield, TrendingUp, TrendingDown, Clock, Award, GraduationCap, BookOpen } from 'lucide-react';

interface UserTrustHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileDto | null;
}

export const UserTrustHistoryModal: React.FC<UserTrustHistoryModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const targetUserId = (user as any)?.userId || user?.id || '';

  const { data: responseData, isLoading } = useGetUserTrustScoreHistoryQuery(targetUserId, {
    skip: !targetUserId || !isOpen,
  });

  if (!user) return null;

  const history: TrustScoreHistoryItem[] = Array.isArray(responseData)
    ? responseData
    : (responseData as any)?.history || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-teal-600" />
          <span>Lịch Sử Biến Động Điểm Uy Tín — {user.fullName || user.email}</span>
        </div>
      }
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* User Summary Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-bold text-white shadow-xs shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                (user.fullName || user.email).charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user.fullName || 'Thành viên'}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 2 Cột: Điểm Người Dạy & Người Học */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cột 1: Người Dạy */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Người Dạy</span>
            </div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {user.mentorTrustScore ?? user.trustScore ?? 100}
              </span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200/80 px-2 py-0.5 rounded-md inline-block">
                Chất lượng dạy
              </span>
            </div>
          </div>

          {/* Cột 2: Người Học */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Người Học</span>
            </div>
            <div className="flex items-baseline justify-center gap-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {user.learnerTrustScore ?? 100}
              </span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md inline-block">
                Đúng giờ & Cam kết
              </span>
            </div>
          </div>
        </div>

        {/* History Timeline List */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Nhật Ký Biến Động Điểm Bất Biến (Ledger)</span>
          </h4>

          {isLoading ? (
            <LoadingSpinner size="sm" text="Đang tải lịch sử điểm uy tín..." />
          ) : history.length === 0 ? (
            <EmptyState
              icon={Award}
              title="Chưa có biến động điểm"
              description="Người dùng này chưa có lượt cộng hoặc trừ điểm uy tín nào."
            />
          ) : (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {history.map((item) => {
                const delta = item.delta ?? 0;
                const isPositive = delta > 0;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl border ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            : 'bg-rose-50 text-rose-600 border-rose-200'
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.reason}</p>
                        <p className="text-[11px] text-slate-400">
                          {new Date(item.createdAt || (item as any).occurredAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold ${
                          isPositive ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isPositive ? `+${delta}` : delta}đ
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {item.scoreBefore} → {item.scoreAfter}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
};
