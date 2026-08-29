import type { BadgeVariant } from '@/shared/components/Badge';
import type { SelectOption } from '@/shared/components/Select';
import type { AccountRole, AccountStatus } from '../types';

export const ACCOUNT_ROLE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất Cả Quyền Hạn' },
  { value: 'USER', label: 'Sinh Viên / Người Dùng (USER)' },
  { value: 'MODERATOR', label: 'Kiểm Duyệt Viên (MODERATOR)' },
  { value: 'ADMIN', label: 'Quản Trị Viên (ADMIN)' },
];

export const ACCOUNT_STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'Tất Cả Trạng Thái' },
  { value: 'ACTIVE', label: 'Đang Hoạt Động (ACTIVE)' },
  { value: 'PENDING_VERIFY', label: 'Chờ Xác Thực OTP (PENDING)' },
  { value: 'LOCKED', label: 'Đã Bị Khóa (LOCKED)' },
];

export const ACCOUNT_ROLE_BADGES: Record<AccountRole, { label: string; variant: BadgeVariant }> = {
  USER: { label: 'Người dùng', variant: 'slate' },
  MODERATOR: { label: 'Kiểm duyệt viên', variant: 'primary' },
  ADMIN: { label: 'Quản trị viên', variant: 'purple' },
};

export const ACCOUNT_STATUS_BADGES: Record<AccountStatus, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: 'Đang hoạt động', variant: 'success' },
  PENDING_VERIFY: { label: 'Chờ xác thực', variant: 'warning' },
  LOCKED: { label: 'Đã khóa', variant: 'danger' },
};
