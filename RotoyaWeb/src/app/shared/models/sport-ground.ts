import { IPagination } from './base';
import { ISportGroundTimeSlot } from './time-slot';

export interface ISportGround {
    id?: number;
    sportCenterId?: number;
    sportId?: number;
    name?: string;
    code?: string;
    type?: string;
    avatar?: string;
    quantity?: number;
    quantityInStock?: number;
    description?: string;
    sportGroundTimeSlots?: ISportGroundTimeSlot[];
}

export interface ISportGroundQuery extends ISportGround, IPagination { }