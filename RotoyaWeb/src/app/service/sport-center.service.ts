import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { ISportCenterFull, ISportCenter, ISportCenterQuery } from '../shared/models/sport-center';

@Injectable({ providedIn: 'root' })
export class SportCenterService extends BaseService<ISportCenter, ISportCenterQuery> {
    path_url: string = '/sport-center';

    getSportCenter(id: number, timestamp?: number): Observable<ISportCenterFull> {
        const params = timestamp ? { time: timestamp + '' } : {};
        return this.http.get<ISportCenterFull>(`${this.url}/${id}`, { params });
    }

    getSportCenters(opts?: any): Observable<ISportCenter[]> {
        return this.http.get<ISportCenter[]>(`${this.url}`, { params: opts });
    }
}