import type { BadgeVariant } from '@/shared/components/Badge';
import type { SelectOption } from '@/shared/components/Select';

export const TIER_BADGE_MAP: Record<string, { label: string; variant: BadgeVariant }> = {
  EXCELLENT: { label: 'Xuất Sắc', variant: 'success' },
  GOOD: { label: 'Tốt', variant: 'primary' },
  AVERAGE: { label: 'Trung Bình', variant: 'warning' },
  WARNING: { label: 'Cảnh Báo', variant: 'danger' },
  LOCKED: { label: 'Đã Khóa', variant: 'slate' },
};

export const MENTOR_TIER_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất cả phân hạng Người Dạy' },
  { value: 'EXCELLENT', label: 'Dạy: Xuất Sắc (≥120đ)' },
  { value: 'GOOD', label: 'Dạy: Tốt (≥80đ)' },
  { value: 'AVERAGE', label: 'Dạy: Trung Bình (≥50đ)' },
  { value: 'WARNING', label: 'Dạy: Cảnh Báo (>0đ)' },
  { value: 'LOCKED', label: 'Dạy: Đã Khóa (0đ)' },
];

export const TIER_OPTIONS = MENTOR_TIER_OPTIONS;
