import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { ISportCenter } from '../models/sport-center';

@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
    private _sportCenters: ISportCenter[] = [];
    private _sportCenterSelected: ISportCenter = {};

    public sportCenterSubject$: Subject<any> = new Subject();
    public sportCenterSelectedSubject$: Subject<any> = new Subject();

    constructor() { }

    set sportCenters(sportCenters: ISportCenter[]) {
        this._sportCenters = sportCenters;
    }

    get sportCenters() {
        return this._sportCenters;
    }

    set sportCenterSelected(sportCenter: ISportCenter) {
        this._sportCenterSelected = sportCenter;
    }

    get sportCenterSelected() {
        return this._sportCenterSelected;
    }

    public clear(): void {
        this._sportCenters = [];
        this._sportCenterSelected = {};
    }

    public changeOneSportCenter(data: ISportCenter): void {
        if (!this._sportCenters || !this._sportCenters.length) return;
        const index = this._sportCenters.findIndex(sportCenter => data.id == sportCenter.id);
        if (index < 0) return;
        this._sportCenters[index] = data;
        this._sportCenterSelected = data;
        this.sportCenterSelectedSubject$.next(null);
    }

}