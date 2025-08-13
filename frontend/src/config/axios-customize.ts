import axios from 'axios';
import { Mutex } from 'async-mutex';
import { setRefreshTokenAction } from '../redux/auth/account.slice'; // OK to import actions
import type { IBackendRes } from '../types/backend';

const BASE_URL = import.meta.env.VITE_BACKEND_URL as string;

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

let storeRef: any = null;
export const injectStore = (s: any) => {
    storeRef = s;
};

const mutex = new Mutex();
const NO_RETRY_HEADER = 'x-no-retry';

interface AccessTokenResponse {
    access_token: string;
}

const handleRefreshToken = async (): Promise<string | null> => {
    return await mutex.runExclusive(async () => {
        const res =
            await instance.get<IBackendRes<AccessTokenResponse>>(
                '/api/auth/refresh',
            );
        if (res.data && res.data.data) return res.data.data.access_token;
        else return null;
    });
};

instance.interceptors.request.use((config) => {
    // ensure headers object exists
    config.headers = config.headers || {};

    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('access_token')
            : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // default headers
    if (!config.headers.Accept) config.headers.Accept = 'application/json';
    if (!config.headers['Content-Type'])
        config.headers['Content-Type'] = 'application/json; charset=utf-8';

    return config;
});

instance.interceptors.response.use(
    // return full axios response so callers can choose (we normalize below if needed)
    (res) => res,
    async (error) => {
        const { config, response } = error || {};

        // Try refresh on 401 (except login endpoint), only once per request (NO_RETRY_HEADER)
        if (
            config &&
            response &&
            response.status === 401 &&
            !config.url?.includes('/api/auth/login') &&
            !config.headers?.[NO_RETRY_HEADER]
        ) {
            const access_token = await handleRefreshToken();
            // mark to prevent retry loop
            config.headers = config.headers || {};
            config.headers[NO_RETRY_HEADER] = 'true';

            if (access_token) {
                localStorage.setItem('access_token', access_token);
                config.headers.Authorization = `Bearer ${access_token}`;
                // retry original request using our instance (which will attach new token)
                try {
                    const retryRes = await instance.request(config);
                    return retryRes;
                } catch (retryErr) {
                    // fallthrough to reject below
                }
            }
        }

        // If refresh endpoint returned 400 and we are in admin page => dispatch notification action
        if (
            config &&
            response &&
            response.status === 400 &&
            config.url?.includes('/api/auth/refresh') &&
            typeof location !== 'undefined' &&
            location.pathname.startsWith('/admin')
        ) {
            const message =
                response?.data?.message ?? 'Có lỗi xảy ra, vui lòng login.';
            storeRef?.dispatch(
                setRefreshTokenAction({ status: true, message }),
            );
        }

        // normalize rejection: prefer response.data if present
        return Promise.reject(response?.data ?? error);
    },
);

export default instance;
