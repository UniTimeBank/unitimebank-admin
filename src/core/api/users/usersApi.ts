import { baseApi } from '../baseApi';
import type {
  UserProfileDto,
  GetUsersQuery,
  GetUsersResponse,
} from '@/features/users/types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<GetUsersResponse, GetUsersQuery>({
      query: (params) => ({
        url: '/users',
        method: 'GET',
        params,
      }),
      providesTags: ['Users'],
    }),
    getUserById: builder.query<UserProfileDto, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery } = usersApi;
