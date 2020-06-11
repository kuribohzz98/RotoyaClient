import { ISportGroundTimeSlot } from './time-slot';
export interface IBooking {
    id?: number;
    timeSlotId?: number;
    paymentId?: number;
    bookingDate?: string;
    detail?: string;
    equipment?: string;
    sportGroundTimeSlot?: ISportGroundTimeSlot;
}