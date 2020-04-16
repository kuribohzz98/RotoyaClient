import { SportGroundTimeSlot } from './time-slot';

export interface SportGround {
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
    sportGroundTimeSlots?: SportGroundTimeSlot[];
}