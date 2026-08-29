import React, { useState } from 'react';
import { useGetUsersQuery } from '@/core/api/users/usersApi';
import type { UserProfileDto } from '@/features/users/types';
import { TIER_BADGE_MAP, MENTOR_TIER_OPTIONS } from '../constants';
import {
  Badge,
  Select,
  LoadingSpinner,
  EmptyState,
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/components';
import { UserTrustHistoryModal } from '../components/UserTrustHistoryModal';
import { UserSkillsModal } from '../components/UserSkillsModal';
import { UserDetailModal } from '../components/UserDetailModal';
import { Users, Search, Shield, Eye } from 'lucide-react';

export const UsersListPage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [detailUser, setDetailUser] = useState<UserProfileDto | null>(null);
  const [historyUser, setHistoryUser] = useState<UserProfileDto | null>(null);
  const [skillsModalUser, setSkillsModalUser] = useState<UserProfileDto | null>(null);

  const { data: usersData, isLoading } = useGetUsersQuery({
    search: searchKeyword || undefined,
    tier: selectedTier || undefined,
    page: 1,
    limit: 50,
  });

  const users = usersData?.users || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-teal-600" />
          <span>Người Dùng & Điểm Uy Tín 360°</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý hồ sơ thành viên, tiểu sử giới thiệu, kỹ năng và theo dõi phân hạng uy tín Người Dạy / Người Học
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="w-full sm:w-60">
          <Select
            options={MENTOR_TIER_OPTIONS}
            value={selectedTier}
            onChange={(val) => setSelectedTier(val)}
            size="sm"
          />
        </div>

        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo tên hiển thị, email, bio hoặc kỹ năng..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 transition-all"
          />
        </div>
      </div>

      {/* Shared Table Container */}
      {isLoading ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-12 shadow-xs">
          <LoadingSpinner text="Đang tải danh sách người dùng..." />
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200/80 p-8 shadow-xs">
          <EmptyState
            icon={Users}
            title="Không tìm thấy người dùng"
            description="Không có người dùng nào khớp với bộ lọc đã chọn."
          />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="min-w-[220px]">Thành Viên & Mô Tả</TableHead>
              <TableHead className="min-w-[180px]">Kỹ Năng</TableHead>
              <TableHead className="min-w-[150px]">Điểm Người Dạy</TableHead>
              <TableHead className="min-w-[150px]">Điểm Người Học</TableHead>
              <TableHead className="min-w-[100px]">Ví Credit</TableHead>
              <TableHead className="min-w-[100px]">Ngày Tạo</TableHead>
              <TableHead className="text-right">Thao Tác</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const mentorTier = user.mentorTier || user.tier || 'GOOD';
              const mentorTierMeta = TIER_BADGE_MAP[mentorTier] || { label: mentorTier, variant: 'slate' };

              const learnerTier = user.learnerTier || 'GOOD';
              const learnerTierMeta = TIER_BADGE_MAP[learnerTier] || { label: learnerTier, variant: 'primary' };

              const skills = user.skills || [];
              const mentorScore = user.mentorTrustScore ?? user.trustScore ?? 100;
              const learnerScore = user.learnerTrustScore ?? 100;

              return (
                <TableRow key={user.id}>
                  {/* Member Info & Bio */}
                  <TableCell>
                    <div
                      onClick={() => setDetailUser(user)}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal-600 group-hover:ring-2 group-hover:ring-teal-500/40 flex items-center justify-center font-bold text-white shadow-xs shrink-0 mt-0.5 transition-all">
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
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 group-hover:text-teal-700 text-xs truncate transition-colors">
                          {user.fullName || user.displayName || 'Chưa đặt tên'}
                        </p>
                        <p className="text-[11px] text-slate-500 font-normal truncate">{user.email}</p>
                        {user.bio ? (
                          <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5" title={user.bio}>
                            "{user.bio}"
                          </p>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic block mt-0.5">
                            Chưa cập nhật giới thiệu
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Skills (Clickable to open category modal) */}
                  <TableCell>
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5 max-w-[220px]">
                        {skills.slice(0, 3).map((s) => (
                          <span
                            key={s.id}
                            onClick={() => setSkillsModalUser(user)}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
                            title="Bấm để xem phân loại danh mục chi tiết"
                          >
                            {s.name}
                          </span>
                        ))}
                        {skills.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setSkillsModalUser(user)}
                            className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/80 cursor-pointer transition-colors"
                            title="Xem toàn bộ kỹ năng theo danh mục"
                          >
                            +{skills.length - 3}
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </TableCell>

                  {/* Mentor Trust Score + Tier Badge */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {mentorScore}đ
                      </span>
                      <Badge variant={mentorTierMeta.variant}>{mentorTierMeta.label}</Badge>
                    </div>
                  </TableCell>

                  {/* Learner Trust Score + Tier Badge */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {learnerScore}đ
                      </span>
                      <Badge variant={learnerTierMeta.variant}>{learnerTierMeta.label}</Badge>
                    </div>
                  </TableCell>

                  {/* Live Credit Balance */}
                  <TableCell className="whitespace-nowrap">
                    <span className="font-bold text-slate-900 text-xs">
                      {user.creditBalance ?? 0}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal ml-1">Credit</span>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="text-slate-500 text-[11px] whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </TableCell>

                  {/* Actions (View Detail & History) */}
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDetailUser(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                        title="Xem chi tiết hồ sơ & điều chỉnh điểm"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>Chi Tiết</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHistoryUser(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer"
                        title="Xem lịch sử biến động điểm"
                      >
                        <Shield className="w-3.5 h-3.5 text-teal-600" />
                        <span>Lịch Sử</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* User 360 Detail Modal & Admin Trust Adjustment */}
      <UserDetailModal
        isOpen={!!detailUser}
        onClose={() => setDetailUser(null)}
        user={detailUser}
        onOpenHistory={() => {
          setHistoryUser(detailUser);
        }}
      />

      {/* Trust Score History Modal */}
      <UserTrustHistoryModal
        isOpen={!!historyUser}
        onClose={() => setHistoryUser(null)}
        user={historyUser}
      />

      {/* Full Categorized Skills Modal */}
      <UserSkillsModal
        isOpen={!!skillsModalUser}
        onClose={() => setSkillsModalUser(null)}
        user={skillsModalUser}
      />
    </div>
  );
};
