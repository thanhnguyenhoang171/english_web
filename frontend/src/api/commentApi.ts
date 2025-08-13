import axios from '../config/axios-customize';
import type { IBackendRes, IComment } from '../types/backend';

export const callFetchComment = (postId: string) => {
    return axios.get<IBackendRes<IComment>>(`/api/posts/${postId}/comments`);
};

export const callPostComment = (postId: string, content: string) => {
    return axios.post<IBackendRes<IComment>>(`/api/posts/${postId}/comments`, {
        content,
    });
};

export const callFetchOwnerComment = () => {
    return axios.get<IBackendRes<IComment>>(`/api/posts/comments/owner`);
};

export const callDeleteComment = (id: string) => {
    return axios.delete<IBackendRes<IComment>>(`/api/posts/comments/${id}`);
};

export const callUpdateComment = (id: string, data: any) => {
    return axios.patch<IBackendRes<IComment>>(
        `/api/posts/comments/${id}`,
        data,
    );
};
