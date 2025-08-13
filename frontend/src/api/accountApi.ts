import axios from '../config/axios-customize';
import type {
    IBackendRes,
    IAccount,
    IGetAccount,
    IUser,
} from '../types/backend';

// Account Authentication Module

export const callRegister = (
    name: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    address: string,
    confirmPassword: string,
) => {
    return axios.post<IBackendRes<IUser>>('/api/auth/register', {
        name,
        email,
        password,
        age,
        gender,
        address,
        confirmPassword,
    });
};

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/auth/account');
};

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/auth/login', {
        username,
        password,
    });
};

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/auth/logout');
};
