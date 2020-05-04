import { IPagination } from './base';
import { IBooking } from './booking';
import { IUser } from './user';

export interface IPayment {
    id?: number;
    userId?: number;
    sportCenterId?: number;
    amount?: number;
    currency?: string;
    orderId?: string;
    transactionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    bookings?: IBooking[];
    user?: IUser[];
}

export interface IPaymentQuery extends IPayment, IPagination { }