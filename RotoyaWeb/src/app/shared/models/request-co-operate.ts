import { IPagination } from './base';
export interface IRequestCoOperate {
    id?: number;
    status?: string;
    firstName?: string;
    lastName?: string;
    phone?: number;
    email?: string;
    city?: string;
    district?: string;
    commune?: string;
    address?: string;
    note?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IRequestCoOperateQuery extends IRequestCoOperate, IPagination { }