import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { IPayment, IPaymentQuery } from './../shared/models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService extends BaseService<IPayment, IPaymentQuery> {
    path_url: string = '/payment';

    getInfoPayment(timeSlotId: number, time?: number): Observable<IPayment[]> {
        return this.http.get<IPayment[]>(this.url + '/info', { params: { timeSlotId: timeSlotId + '', time: time + '' } });
    }

    getOneByOrderId(orderId: string): Observable<IPayment> {
        return this.http.get<IPayment>(this.url + '/get-one', { params: { orderId: orderId } });
    }

    getBySportCenterId(sportCenterId: number, startDate: number, endDate: number): Observable<IPayment[]> {
        return this.http.get<IPayment[]>(this.url + '/by-sport-center-id',
            {
                params: {
                    sportCenterId: sportCenterId + '',
                    startDate: startDate + '',
                    endDate: endDate + ''
                }
            })
    }
}