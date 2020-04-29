import { IPagination } from './base';
import { ISportGround } from './sport-ground';
import { ISport } from './sport';

export interface ISportCenter {
    id?: number;
    userId?: number;
    name?: string;
    code?: string;
    country?: string;
    city?: string;
    district?: string;
    commune?: string;
    address?: string;
    avatar?: string;
    latitude?: number;
    longitude?: number;
    timeOpen?: number;
    timeClose?: number;
}

export interface ISportCenterFull extends ISportCenter {
    sportGrounds: ISportGround[];
    sports: ISport[];
}

export interface ISportCenterQuery extends ISportCenter, IPagination { }