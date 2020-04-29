import { IPagination } from './base';
export interface ISport {
    id?: number;
    name?: string;
    code?: string;
}

export interface ISportQuery extends ISport, IPagination { }
