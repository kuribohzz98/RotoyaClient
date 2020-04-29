import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { ISportCenter } from '../models/sport-center';

@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
    private _sportCenters: ISportCenter[] = [];
    private _sportCenterSelected: ISportCenter = {};

    public sportCenterSubject$: Subject<any> = new Subject();
    public sportCenterSelectedSubject$: Subject<any> = new Subject();

    constructor() {}

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

    clear() {
        this._sportCenters = [];
        this._sportCenterSelected = {};
    }

}