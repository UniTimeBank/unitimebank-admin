import type { BadgeVariant } from '@/shared/components/Badge';
import type { SelectOption } from '@/shared/components/Select';
import type { ReportCategory } from '../types';

export const REPORT_STATUS_TABS = [
  { key: '', label: 'Tất Cả' },
  { key: 'PENDING', label: 'Chờ Xử Lý' },
  { key: 'INVESTIGATING', label: 'Đang Xem Xét' },
  { key: 'RESOLVED', label: 'Đã Giải Quyết' },
  { key: 'DISMISSED', label: 'Đã Bỏ Qua' },
];

export const REPORT_CATEGORY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất Cả Loại Vi Phạm' },
  { value: 'AFK_ABUSE', label: 'Bỏ Lớp / AFK' },
  { value: 'TOXIC_LANGUAGE', label: 'Thái Độ Xấu / Xúc Phạm' },
  { value: 'FRAUD', label: 'Gian Lận Credit' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Nội Dung Phản Cảm' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'OTHER', label: 'Lý Do Khác' },
];

export const REPORT_CATEGORY_LABELS: Record<ReportCategory, { label: string; variant: BadgeVariant }> = {
  AFK_ABUSE: { label: 'Bỏ lớp', variant: 'warning' },
  TOXIC_LANGUAGE: { label: 'Xúc phạm / Thái độ', variant: 'danger' },
  FRAUD: { label: 'Gian lận Credit', variant: 'danger' },
  INAPPROPRIATE_CONTENT: { label: 'Nội dung phản cảm', variant: 'purple' },
  SPAM: { label: 'Spam', variant: 'amber' as any },
  OTHER: { label: 'Khác', variant: 'slate' },
};

export const MODERATION_DECISION_OPTIONS: SelectOption[] = [
  { value: 'WARNING', label: '⚠️ Cảnh cáo nhắc nhở (Warning)' },
  { value: 'DEDUCT_TRUST_SCORE', label: '📉 Phạt trừ Điểm Uy Tín (Trust Score Penalty)' },
  { value: 'DEDUCT_CREDIT', label: '💰 Phạt trừ Credit do gian lận' },
  { value: 'SUSPEND_TEMPORARY', label: '⛔ Khóa tài khoản tạm thời' },
  { value: 'BAN_PERMANENT', label: '🚫 Khóa vĩnh viễn (Cấm vĩnh viễn)' },
  { value: 'DISMISS', label: '✅ Không phát hiện vi phạm (Bỏ qua)' },
];
