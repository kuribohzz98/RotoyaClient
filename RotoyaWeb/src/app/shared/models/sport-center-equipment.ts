import { IPagination } from './base';
export interface ISportCenterEquipment {
    id?: number;
    sportId?: number;
    sportCenterId?: number;
    sportEquipmentId?: number;
    name?: string;
    price?: number;
    quantity?: number;
    image?: string;
    isDelete?: boolean;
}

export interface ISportCenterEquipmentQuery extends ISportCenterEquipment, IPagination { }
