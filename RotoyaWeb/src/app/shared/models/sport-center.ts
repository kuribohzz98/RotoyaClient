import { SportGround } from './sport-ground';
import { Sport } from './sport';

export interface SportCenter {
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

export interface SportCenterFull extends SportCenter {
    sportGrounds: SportGround[];
    sports: Sport[];
}