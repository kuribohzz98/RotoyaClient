import { SortType } from './../../constants/common.constants';

export interface IPagination {
    page?: number;
    limit?: number;
    sort?: string;
    sortType?: SortType;
    count?: boolean;
}