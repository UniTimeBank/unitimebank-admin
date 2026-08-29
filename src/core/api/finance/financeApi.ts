import { baseApi } from '../baseApi';
import type { FinanceStats, FinanceLedgerResponse } from '@/features/finance/types';

export const financeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinanceStats: builder.query<FinanceStats, void>({
      query: () => '/wallets/admin/stats',
      providesTags: ['Finance'],
    }),
    getFinanceLedger: builder.query<FinanceLedgerResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/wallets/admin/ledger',
        params: params || { page: 1, limit: 50 },
      }),
      providesTags: ['Finance'],
    }),
  }),
});

export const { useGetFinanceStatsQuery, useGetFinanceLedgerQuery } = financeApi;
