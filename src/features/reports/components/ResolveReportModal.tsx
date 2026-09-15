import React, { useState } from 'react';
import { Modal } from '@/shared/components/Modal';
import { Select } from '@/shared/components/Select';
import type {
  ViolationReport,
  ModerationDecisionType,
} from '@/features/reports/types';
import { MODERATION_DECISION_OPTIONS } from '../constants';
import { useResolveReportMutation } from '@/core/api/moderation/moderationApi';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ViolationReport | null;
}

export const ResolveReportModal: React.FC<ResolveReportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [decision, setDecision] = useState<ModerationDecisionType>('WARNING');
  const [trustScorePenalty, setTrustScorePenalty] = useState<number>(10);
  const [targetRole, setTargetRole] = useState<'MENTOR' | 'LEARNER' | 'ALL'>('MENTOR');
  const [creditPenalty, setCreditPenalty] = useState<number>(0);
  const [adminNotes, setAdminNotes] = useState<string>('');

  const [resolveReport, { isLoading }] = useResolveReportMutation();

  if (!report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await resolveReport({
        reportId: report.id,
        decision,
        decisionType: decision,
        trustScorePenalty: decision === 'DEDUCT_TRUST_SCORE' || decision === 'BAN_PERMANENT' ? trustScorePenalty : 0,
        targetRole: decision === 'DEDUCT_TRUST_SCORE' || decision === 'BAN_PERMANENT' ? targetRole : undefined,
        creditPenalty: decision === 'DEDUCT_CREDIT' ? creditPenalty : 0,
        adminNotes: adminNotes.trim() || undefined,
        note: adminNotes.trim() || undefined,
      }).unwrap();

      toast.success('Đã thực thi quyết định xử lý báo cáo vi phạm thành công!');
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Không thể xử lý báo cáo lúc này.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>Xử Lý Báo Cáo Vi Phạm #{report.id.substring(0, 8)}</span>
        </div>
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          Người bị báo cáo: <strong className="text-rose-700 font-bold">{report.reportedUserName || report.reportedUserId}</strong>
          <br />
          Lý do: <span className="text-slate-600">{report.description}</span>
        </div>

        {/* Custom Decision Select */}
        <div>
          <Select
            label="Hình Thức Xử Lý"
            options={MODERATION_DECISION_OPTIONS}
            value={decision}
            onChange={(val) => setDecision(val as ModerationDecisionType)}
          />
        </div>

        {/* Penalty inputs if applicable */}
        {(decision === 'DEDUCT_TRUST_SCORE' || decision === 'BAN_PERMANENT') && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 animate-in fade-in duration-200">
            <div>
              <label className="block text-[11px] font-bold text-rose-800 mb-1 uppercase tracking-wider">
                Vai Trò Bị Trừ Điểm Uy Tín
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetRole('MENTOR')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    targetRole === 'MENTOR'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Người Dạy
                </button>
                <button
                  type="button"
                  onClick={() => setTargetRole('LEARNER')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    targetRole === 'LEARNER'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Người Học
                </button>
                <button
                  type="button"
                  onClick={() => setTargetRole('ALL')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    targetRole === 'ALL'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Cả Hai Vai Trò
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-rose-800 mb-1 uppercase tracking-wider">
                Số Điểm Uy Tín Bị Trừ (0 - 100)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={trustScorePenalty}
                  onChange={(e) => setTrustScorePenalty(Number(e.target.value))}
                  className="w-32 px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-slate-900 text-xs font-bold focus:outline-none focus:border-rose-600"
                />
                <span className="text-xs text-rose-700 font-medium">
                  Điểm uy tín sẽ bị trừ trực tiếp sau khi duyệt.
                </span>
              </div>
            </div>
          </div>
        )}

        {decision === 'DEDUCT_CREDIT' && (
          <div className="animate-in fade-in duration-200">
            <label className="block text-[11px] font-bold text-amber-700 mb-1 uppercase tracking-wider">
              Số Credit Phạt Thu Hồi
            </label>
            <input
              type="number"
              min="1"
              value={creditPenalty}
              onChange={(e) => setCreditPenalty(Number(e.target.value))}
              className="w-32 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:bg-white focus:border-teal-600"
            />
          </div>
        )}

        {/* Admin Notes */}
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
            Ghi Chú Quyết Định Của Quản Trị Viên
          </label>
          <textarea
            rows={3}
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            placeholder="Nhập lý do hoặc nội dung phản hồi chính thức tới các bên liên quan..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-teal-600 transition-colors"
          />
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-800">
          <AlertCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            Quyết định này sẽ được ghi vào nhật ký hệ thống và tự động gửi thông báo đến các bên liên quan.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Xác Nhận & Thực Thi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
