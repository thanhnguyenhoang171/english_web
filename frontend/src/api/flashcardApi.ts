import type { Flashcard } from '../components/flashcard/flashcard.modal';
import axios from '../config/axios-customize';
import type { IBackendRes } from '../types/backend';

export const callFetchFlashcardById = (flashcardId: string) => {
    return axios.get<IBackendRes<Flashcard>>(`/api/flashcards/${flashcardId}`);
};

export const callFetchFlashcard = () => {
    return axios.get<IBackendRes<Flashcard>>(`/api/flashcards`);
};

export const callPostFlashcard = (
    data: any, // FormData object
) => {
    return axios.post(`/api/flashcards`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const callUpdateFlashcard = (id: string, data: FormData) => {
    return axios.patch<IBackendRes<Flashcard>>(`/api/flashcards/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const callDeleteFlashcard = (id: string) => {
    return axios.delete<IBackendRes<any>>(`/api/flashcards/${id}`);
};
