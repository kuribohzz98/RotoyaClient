import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { SportCenter } from '../models/sport-center';

@Injectable({ providedIn: 'root' })
export class AdminLayoutService {
    private _sportCenters: SportCenter[] = [];
    private _sportCenterSelected: SportCenter = {};

    public sportCenterSubject$: Subject<any> = new Subject();
    public sportCenterSelectedSubject$: Subject<any> = new Subject();

    constructor() {}

    set sportCenters(sportCenters: SportCenter[]) {
        this._sportCenters = sportCenters;
    }

    get sportCenters() {
        return this._sportCenters;
    }

    set sportCenterSelected(sportCenter: SportCenter) {
        this._sportCenterSelected = sportCenter;
    }

    get sportCenterSelected() {
        return this._sportCenterSelected;
    }

}