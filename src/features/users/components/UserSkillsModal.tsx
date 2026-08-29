import React from 'react';
import { Modal } from '@/shared/components/Modal';
import type { UserProfileDto } from '@/features/users/types';
import {
  Code,
  Globe,
  Palette,
  BookOpen,
  MessageSquare,
  Briefcase,
  Music,
  Dumbbell,
  Sparkles,
  Star,
  Award,
} from 'lucide-react';

interface UserSkillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfileDto | null;
}

const CATEGORY_MAP: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  PROGRAMMING: { label: 'Lập Trình & Công Nghệ', icon: Code, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  LANGUAGE: { label: 'Ngoại Ngữ', icon: Globe, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  DESIGN: { label: 'Thiết Kế & Đồ Họa', icon: Palette, color: 'text-pink-700 bg-pink-50 border-pink-200' },
  ACADEMIC: { label: 'Học Thuật & Môn Học', icon: BookOpen, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  SOFT_SKILLS: { label: 'Kỹ Năng Mềm', icon: MessageSquare, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  BUSINESS: { label: 'Kinh Doanh & Marketing', icon: Briefcase, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  MUSIC: { label: 'Âm Nhạc & Nghệ Thuật', icon: Music, color: 'text-rose-700 bg-rose-50 border-rose-200' },
  SPORTS: { label: 'Thể Thao & Sức Khỏe', icon: Dumbbell, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  OTHER: { label: 'Kỹ Năng Khác', icon: Sparkles, color: 'text-slate-700 bg-slate-100 border-slate-200' },
};

export const UserSkillsModal: React.FC<UserSkillsModalProps> = ({ isOpen, onClose, user }) => {
  if (!user) return null;

  const skills = user.skills || [];

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'OTHER';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categoryKeys = Object.keys(groupedSkills);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-teal-600" />
          <span>Danh Sách Kỹ Năng — {user.fullName || user.displayName || user.email}</span>
        </div>
      }
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* User Info Header */}
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
              <p className="text-sm font-bold text-slate-900">{user.fullName || user.displayName || 'Thành viên'}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium">Tổng kỹ năng:</span>
            <p className="text-lg font-black text-teal-700">{skills.length} kỹ năng</p>
          </div>
        </div>

        {/* Bio if available */}
        {user.bio && (
          <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-200/80 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">Giới thiệu bản thân:</span>
            <p className="leading-relaxed text-slate-600 italic">"{user.bio}"</p>
          </div>
        )}

        {/* Skills Grouped by Categories */}
        {skills.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
            Người dùng này chưa cập nhật kỹ năng nào trên hồ sơ.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {categoryKeys.map((catKey) => {
              const catMeta = CATEGORY_MAP[catKey] || CATEGORY_MAP.OTHER;
              const Icon = catMeta.icon;
              const catSkills = groupedSkills[catKey];

              return (
                <div
                  key={catKey}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${catMeta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {catMeta.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold ml-auto">
                      ({catSkills.length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {catSkills.map((s) => (
                      <span
                        key={s.id}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          s.isStrong
                            ? 'bg-amber-50 text-amber-800 border-amber-200 font-semibold shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {s.isStrong && <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                        <span>{s.name}</span>
                        {s.isStrong && (
                          <span className="text-[10px] text-amber-600 font-bold ml-0.5">
                            (Thế mạnh)
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-2 border-t border-slate-200 text-right">
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
