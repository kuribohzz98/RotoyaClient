import { ISportGround } from './sport-ground';
import { IPagination } from './base';
export interface ISportGroundTimeSlot {
    id?: number;
    sportGroundId?: number;
    startTime?: number;
    endTime?: number;
    price?: number;
    sportGround?: ISportGround;
}

export interface ISportGroundTimeSlotQuery extends ISportGroundTimeSlot, IPagination { }
