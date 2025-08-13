export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IAccount {
    access_token: string;
    user: {
        _id: string;
        email: string;
        name: string;
        role: string;
    };
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: string;
    address: string;
    role: string;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IGetAccount extends Omit<IAccount, 'access_token'> {}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    age: number;
    gender: string;
    address: string;
    role?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
}

export interface IPost {
    _id?: string;
    title: string;
    content: string;
    meaning?: string;
    flashcards?: {
        type: string;
        frontText: string;
        frontImage: string | null;
        back: string;
        example: string;
        tags: string[];
    }[];
    createdBy?: {
        _id: string;
        email: string;
    };

    createdAt?: string;
}

export interface IModelPaginate<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: T[];
}

export interface IComment {
    _id?: string;
    postId?: string;
    content: string;
    createdBy?: {
        _id: string;
        email: string;
    };

    createdAt?: string;
}
