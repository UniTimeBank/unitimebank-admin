import { baseApi } from '../baseApi';
import type {
  GetAccountsQuery,
  GetAccountsResponse,
  UserAccountItem,
} from '@/features/accounts/types';

export const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<GetAccountsResponse, GetAccountsQuery | void>({
      query: (params) => ({
        url: '/auth/admin/accounts',
        params: params || { page: 1, limit: 50 },
      }),
      providesTags: ['Users'],
    }),
    updateAccountStatus: builder.mutation<
      UserAccountItem,
      { id: string; status: 'ACTIVE' | 'LOCKED' | 'PENDING_VERIFY' }
    >({
      query: ({ id, status }) => ({
        url: `/auth/admin/accounts/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Users'],
    }),
    updateAccountRole: builder.mutation<
      UserAccountItem,
      { id: string; role: 'USER' | 'MODERATOR' | 'ADMIN' }
    >({
      query: ({ id, role }) => ({
        url: `/auth/admin/accounts/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['Users'],
    }),
    adminResetPassword: builder.mutation<
      { success: boolean; message: string; temporaryPassword?: string },
      { id: string; newPassword?: string }
    >({
      query: ({ id, newPassword }) => ({
        url: `/auth/admin/accounts/${id}/reset-password`,
        method: 'POST',
        body: { newPassword },
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useUpdateAccountStatusMutation,
  useUpdateAccountRoleMutation,
  useAdminResetPasswordMutation,
} = accountsApi;
