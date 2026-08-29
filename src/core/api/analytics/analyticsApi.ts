import { baseApi } from '../baseApi';
import type {
  SystemOverviewStats,
  ActiveGroupRoomDto,
} from '@/features/analytics/types';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query<SystemOverviewStats, void>({
      query: () => '/moderation/stats',
      providesTags: ['Stats'],
    }),
    getActiveRooms: builder.query<{ rooms: ActiveGroupRoomDto[]; total: number }, void>({
      query: () => '/rooms/group/active',
      providesTags: ['Sessions'],
    }),
  }),
});

export const { useGetOverviewStatsQuery, useGetActiveRoomsQuery } = analyticsApi;
