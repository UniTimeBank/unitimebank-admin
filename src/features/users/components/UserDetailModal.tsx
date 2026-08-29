import React, { useState } from 'react';
import { Modal } from '@/shared/components/Modal';
import { Badge } from '@/shared/components/Badge';
import { TIER_BADGE_MAP } from '../constants';
import { useAdjustTrustScoreMutation } from '@/core/api/moderation/moderationApi';
import type { UserProfileDto } from '@/features/users/types';
import toast from 'react-hot-toast';
import {
  User,
  Shield,
  Coins,
  GraduationCap,
  BookOpen,
  Calendar,
  Code,
  Globe,
  Palette,
  Star,
  Sliders,
  Check,
} from 'lucide-react';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileDto | null;
  onOpenHistory?: () => void;
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenHistory,
}) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [deltaPoints, setDeltaPoints] = useState<number>(5);
  const [adjustNote, setAdjustNote] = useState('');

  const [adjustTrustScore, { isLoading: isSavingAdjust }] = useAdjustTrustScoreMutation();

  if (!user) return null;

  const targetUserId = (user as any)?.userId || user?.id || '';
  const mentorTier = user.mentorTier || user.tier || 'GOOD';
  const mentorTierMeta = TIER_BADGE_MAP[mentorTier] || { label: mentorTier, variant: 'slate' };
  const learnerTier = user.learnerTier || 'GOOD';
  const learnerTierMeta = TIER_BADGE_MAP[learnerTier] || { label: learnerTier, variant: 'primary' };
  const skills = user.skills || [];

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deltaPoints) {
      toast.error('Vui lòng nhập số điểm điều chỉnh');
      return;
    }

    try {
      await adjustTrustScore({
        userId: targetUserId,
        delta: Number(deltaPoints),
        note: adjustNote || 'Quản trị viên điều chỉnh thủ công',
      }).unwrap();

      toast.success(
        `Đã điều chỉnh ${deltaPoints > 0 ? `+${deltaPoints}` : deltaPoints} điểm uy tín thành công!`
      );
      setIsAdjusting(false);
      setAdjustNote('');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Không thể điều chỉnh điểm uy tín');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <User className="w-5 h-5 text-teal-600" />
          <span>Hồ Sơ Chi Tiết — {user.fullName || user.displayName || user.email}</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-5">
        {/* User Top Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center font-black text-white text-lg shadow-xs shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                (user.fullName || user.email).charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {user.fullName || user.displayName || 'Chưa đặt tên'}
                </h3>
                {user.role && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 text-[10px] font-bold">
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {targetUserId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsAdjusting(!isAdjusting)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span>{isAdjusting ? 'Hủy Điều Chỉnh' : 'Điều Chỉnh Điểm'}</span>
            </button>
            {onOpenHistory && (
              <button
                type="button"
                onClick={onOpenHistory}
                className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-teal-600" />
                <span>Xem Sổ Cái</span>
              </button>
            )}
          </div>
        </div>

        {/* Adjust Trust Score Form (Collapsible) */}
        {isAdjusting && (
          <form
            onSubmit={handleAdjustSubmit}
            className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3 animate-in fade-in duration-150"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-700" />
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                Quản Trị Viên Can Thiệp Điểm Uy Tín
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">
                  Số điểm thay đổi (+/-)
                </label>
                <input
                  type="number"
                  value={deltaPoints}
                  onChange={(e) => setDeltaPoints(Number(e.target.value))}
                  placeholder="+5 hoặc -10"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-teal-200 text-xs text-slate-900 font-bold focus:outline-none focus:border-teal-600"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-teal-900 mb-1">
                  Lý do điều chỉnh (lưu sổ cái audit)
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="Ví dụ: Bù điểm sự cố hệ thống, Thưởng đóng góp..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-teal-200 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdjusting(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSavingAdjust}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isSavingAdjust ? 'Đang Lưu...' : 'Xác Nhận Điều Chỉnh'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 360° Trust & Wallet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Box 1: Mentor Trust */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Người Dạy</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-2xl font-black text-slate-900">
                {user.mentorTrustScore ?? user.trustScore ?? 100}
              </span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
            <div className="mt-1">
              <Badge variant={mentorTierMeta.variant}>{mentorTierMeta.label}</Badge>
            </div>
          </div>

          {/* Box 2: Learner Trust */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Người Học</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-2xl font-black text-slate-900">
                {user.learnerTrustScore ?? 100}
              </span>
              <span className="text-xs text-slate-400 font-bold">/100</span>
            </div>
            <div className="mt-1">
              <Badge variant={learnerTierMeta.variant}>{learnerTierMeta.label}</Badge>
            </div>
          </div>

          {/* Box 3: Wallet Credit */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Ví Credit</span>
            </div>
            <div className="flex items-baseline justify-center gap-1 my-1">
              <span className="text-2xl font-black text-teal-700">
                {user.creditBalance ?? 0}
              </span>
              <span className="text-xs text-slate-400 font-bold">Credit</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Số dư khả dụng thực tế</p>
          </div>
        </div>

        {/* Bio Section */}
        <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80">
          <span className="text-xs font-bold text-slate-700 block mb-1">
            Tiểu Sử / Giới Thiệu Bản Thân:
          </span>
          <p className="text-xs text-slate-600 italic leading-relaxed">
            {user.bio ? `"${user.bio}"` : 'Chưa cập nhật tiểu sử giới thiệu.'}
          </p>
        </div>

        {/* Skills Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Kỹ Năng Đã Đăng Ký ({skills.length})
            </h4>
          </div>

          {skills.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Người dùng chưa đăng ký kỹ năng nào.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    s.isStrong
                      ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {s.isStrong && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                  <span>{s.name}</span>
                  {s.isStrong && (
                    <span className="text-[10px] text-amber-600 font-bold ml-0.5">
                      (Thế mạnh)
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
          </div>

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
