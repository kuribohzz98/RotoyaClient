import { IPagination } from './base';
export interface ISportGroundTimeSlot {
    id?: number;
    sportGroundId?: number;
    startTime?: number;
    endTime?: number;
    price?: number;
}

export interface ISportGroundTimeSlotQuery extends ISportGroundTimeSlot, IPagination { }
