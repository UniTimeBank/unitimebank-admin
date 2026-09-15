import { baseApi } from '../baseApi';
import type {
  GetReportsResponse,
  GetReportsQuery,
  ResolveReportDto,
  TrustScoreHistoryItem,
} from '@/features/reports/types';

export const moderationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<GetReportsResponse, GetReportsQuery>({
      query: (params) => ({
        url: '/moderation/reports',
        method: 'GET',
        params,
      }),
      providesTags: ['Reports'],
    }),
    resolveReport: builder.mutation<{ success: boolean; message: string }, ResolveReportDto>({
      query: ({ reportId, ...body }) => ({
        url: `/moderation/reports/${reportId}/resolve`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Reports', 'Users', 'Stats'],
    }),
    getUserTrustScoreHistory: builder.query<TrustScoreHistoryItem[], string>({
      query: (userId) => `/moderation/trust-score/${userId}/history`,
      providesTags: (_result, _error, userId) => [{ type: 'Users', id: userId }],
    }),
    adjustTrustScore: builder.mutation<
      { success: boolean; message: string },
      { userId: string; delta: number; roleType?: 'MENTOR' | 'LEARNER'; note?: string }
    >({
      query: (body) => ({
        url: '/moderation/admin/adjust-trust-score',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users', 'Stats'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useResolveReportMutation,
  useGetUserTrustScoreHistoryQuery,
  useAdjustTrustScoreMutation,
} = moderationApi;
