export type TrustScoreTier = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'WARNING' | 'LOCKED';

export interface UserProfileDto {
  id: string;
  userId?: string;
  email: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  skills?: {
    id: string;
    name: string;
    category?: string;
    isStrong?: boolean;
  }[];
  trustScore?: number;
  mentorTrustScore?: number;
  mentorTier?: TrustScoreTier;
  learnerTrustScore?: number;
  learnerTier?: TrustScoreTier;
  tier?: TrustScoreTier;
  creditBalance?: number;
  role?: string;
  createdAt: string;
}

export interface GetUsersQuery {
  search?: string;
  tier?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  users: UserProfileDto[];
  total: number;
  page: number;
  limit: number;
}
