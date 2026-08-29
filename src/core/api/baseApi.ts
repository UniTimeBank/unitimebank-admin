import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    if (headers.has('skip-auth')) {
      headers.delete('skip-auth');
      return headers;
    }

    const publicEndpoints = ['login', 'refresh'];
    if (publicEndpoints.includes(endpoint)) {
      return headers;
    }

    const token = localStorage.getItem('adminAccessToken') || localStorage.getItem('accessToken');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include',
});

// Enhanced base query with reauth handling
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 - token expired
  if (result.error?.status === 401) {
    const refreshToken =
      localStorage.getItem('adminRefreshToken') || localStorage.getItem('refreshToken');

    if (refreshToken) {
      const headers = new Headers();
      headers.set('skip-auth', 'true');

      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
          headers,
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        const resData = (refreshResult.data as any)?.data || refreshResult.data;
        const accessToken = resData?.accessToken;
        const newRefreshToken = resData?.refreshToken;

        if (accessToken) {
          localStorage.setItem('adminAccessToken', accessToken);
          localStorage.setItem('accessToken', accessToken);
          if (newRefreshToken) {
            localStorage.setItem('adminRefreshToken', newRefreshToken);
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          // Retry original request
          result = await baseQuery(args, api, extraOptions);
        } else {
          localStorage.removeItem('adminAccessToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/login';
      }
    }
  }

  return result;
};

// Create base API with RTK Query
export const baseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Reports', 'Users', 'Stats', 'Sessions', 'Finance'],
  endpoints: () => ({}),
});
