import { IPagination } from './base';
export interface Login {
    username: string;
    password: string;
}

export interface IUserInfo {
    firstName?: string;
    lastName?: string;
    phone?: number;
    address?: string;
    email?: string;
    gender?: string;
}

export interface IUserMeta {
    avatar?: string;
}

export interface IUser {
    id?: number;
    username?: string;
    isNew?: boolean;
    userInfo?: IUserInfo;
    userMeta?: IUserMeta;
    roles?: string[];
}

export interface IUserQuery extends IUser, IPagination { }

export type JwtToken = {
    access_token: string;
    user: IUser;
}