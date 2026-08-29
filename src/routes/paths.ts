// Quản lý tập trung các đường dẫn Route trong Admin Portal
export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: '/dashboard',
  REPORTS: '/reports',
  USERS: '/users',
  ACCOUNTS: '/accounts',
  SESSIONS: '/sessions',
  FINANCE: '/finance',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const;
