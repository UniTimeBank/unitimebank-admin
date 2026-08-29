export type AccountRole = 'USER' | 'MODERATOR' | 'ADMIN';
export type AccountStatus = 'PENDING_VERIFY' | 'ACTIVE' | 'LOCKED';

export interface UserAccountItem {
  id: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  trustScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAccountsQuery {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface GetAccountsResponse {
  accounts: UserAccountItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
