import React from 'react';
import { Modal } from '@/shared/components/Modal';
import { Badge } from '@/shared/components/Badge';
import type { ViolationReport } from '@/features/reports/types';
import { REPORT_CATEGORY_LABELS } from '../constants';
import {
  User,
  Calendar,
  FileText,
  Video,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ViolationReport | null;
  onOpenResolve?: (report: ViolationReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  onOpenResolve,
}) => {
  if (!report) return null;

  const catMeta = REPORT_CATEGORY_LABELS[report.category] || {
    label: report.category,
    variant: 'slate',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-teal-700">#{report.id.substring(0, 8)}</span>
          <span>Chi Tiết Báo Cáo Vi Phạm</span>
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Status & Category Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Phân Loại:</span>
            <Badge variant={catMeta.variant}>{catMeta.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Trạng Thái:</span>
            <Badge
              variant={
                report.status === 'RESOLVED'
                  ? 'success'
                  : report.status === 'PENDING'
                  ? 'warning'
                  : 'slate'
              }
              pulse={report.status === 'PENDING'}
            >
              {report.status === 'RESOLVED'
                ? 'Đã Xử Lý'
                : report.status === 'PENDING'
                ? 'Chờ Xử Lý'
                : report.status}
            </Badge>
          </div>
        </div>

        {/* Reporter vs Reported User Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Người Gửi Khiếu Nại
            </span>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {report.reporterName || 'Thành viên'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">ID: {report.reporterId}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
              Người Bị Tố Cáo
            </span>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-900">
                  {report.reportedUserName || 'Thành viên'}
                </p>
                <p className="text-[10px] text-rose-700 font-mono">ID: {report.reportedUserId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Nội Dung / Mô Tả Vi Phạm</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
            {report.description || 'Không có mô tả chi tiết.'}
          </div>
        </div>

        {/* Evidence Video / Images */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Video className="w-4 h-4 text-teal-600" />
            <span>Bằng Chứng Đính Kèm ({report.evidences?.length || 0})</span>
          </div>

          {!report.evidences || report.evidences.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 text-center">
              Không có video hoặc hình ảnh bằng chứng được đính kèm trong báo cáo này.
            </div>
          ) : (
            <div className="space-y-3">
              {report.evidences.map((ev, idx) => (
                <div
                  key={ev.id || idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {ev.evidenceKind === 'VIDEO' ? (
                        <Video className="w-4 h-4 text-teal-600" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-teal-600" />
                      )}
                      <span className="text-xs font-semibold text-slate-800">
                        {ev.evidenceKind === 'VIDEO'
                          ? 'Video Quay Màn Hình In-App'
                          : 'Hình Ảnh Bằng Chứng'}
                      </span>
                    </div>

                    <a
                      href={ev.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-teal-700 hover:text-teal-800 flex items-center gap-1 font-semibold"
                    >
                      <span>Mở liên kết gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Video / Image In-App Player */}
                  {ev.evidenceKind === 'VIDEO' ? (
                    <div className="rounded-lg overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                      <video
                        src={ev.fileUrl}
                        controls
                        className="w-full h-full max-h-72 object-contain"
                      >
                        Trình duyệt không hỗ trợ phát video này.
                      </video>
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden bg-slate-100 max-h-72 flex items-center justify-center">
                      <img
                        src={ev.fileUrl}
                        alt="Evidence"
                        className="max-h-72 object-contain"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ngày gửi: {new Date(report.createdAt).toLocaleString('vi-VN')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            {report.status === 'PENDING' && onOpenResolve && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResolve(report);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ra Quyết Định Xử Lý</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
