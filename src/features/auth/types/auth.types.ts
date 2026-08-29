export interface AdminUser {
  id: string;
  email: string;
  role: 'ADMIN' | 'MODERATOR' | 'USER';
  fullName?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}
