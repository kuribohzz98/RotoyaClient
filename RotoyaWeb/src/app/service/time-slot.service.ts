import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService, ResponseMessage } from './base.service';
import { ISportGroundTimeSlot, ISportGroundTimeSlotQuery } from './../shared/models/time-slot';

@Injectable({ providedIn: 'root' })
export class SportGroundTimeSlotService extends BaseService<ISportGroundTimeSlot, ISportGroundTimeSlotQuery> {
    path_url: string = '/sport-ground-time-slot';
    
    createMany(body: ISportGroundTimeSlot[]): Observable<ResponseMessage> {
        return this.http.post<ResponseMessage>(`${this.url}/multi`, body);
    }
}