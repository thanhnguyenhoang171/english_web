import axios from '../config/axios-customize';
import type { IBackendRes, IModelPaginate, IPost } from '../types/backend';

export const callFetchPost = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPost>>>(`/api/posts?${query}`);
};

export const callFetchOwnerPost = () => {
    return axios.get<IBackendRes<IPost>>(`/api/posts/owner`);
};

export const callUpdatePost = (id: string, data: any) => {
    return axios.patch<IBackendRes<IPost>>(`/api/posts/${id}`, data);
};

export const callDeletePost = (id: string) => {
    return axios.delete<IBackendRes<IPost>>(`/api/posts/${id}`);
};

export const callPostNewPost = (data: any) => {
    return axios.post<IBackendRes<IPost>>(`/api/posts`, data);
};
