import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { SportCenterFull, SportCenter } from './../shared/models/sport-center';

@Injectable({ providedIn: 'root' })
export class SportService extends BaseService {
    path_url: string = '/sport-center';

    getSportCenter(id: number, timestamp?: number): Observable<SportCenterFull> {
        const params = timestamp ? { time: timestamp + '' } : {};
        return this.http.get<SportCenterFull>(`${this.url}/${id}`, { params });
    }

    getSportCenters(opts?: any): Observable<SportCenter[]> {
        return this.http.get<SportCenter[]>(`${this.url}`, { params: opts });
    }
}