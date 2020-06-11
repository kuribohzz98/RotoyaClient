import { IPagination } from './base';
export interface ISportEquipment {
    id?: number;
    sportId?: number;
    name?: string;
    image?: string;
    description?: string;
}

export interface ISportEquipmentQuery extends ISportEquipment, IPagination { }
