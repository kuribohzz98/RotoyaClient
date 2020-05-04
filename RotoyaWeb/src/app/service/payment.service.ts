import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IPayment, IPaymentQuery } from './../shared/models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<IPayment, IPaymentQuery> {
    path_url: string = '/payment';

    getInfoPayment(timeSlotId: number, time?: number) {
        return this.http.get<IPayment[]>(this.url + '/info', { params: { timeSlotId: timeSlotId + '', time: time + '' } });
    }
}