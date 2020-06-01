import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

type Location = {
    latitude?: number;
    longitude?: number;
    save?: boolean;
    cancel?: boolean;
    reload?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SportCenterComponentService {
    private _mapSubject$: Subject<Location> = new Subject();

    constructor() {}

    set mapSubject$(mapSubject$: Subject<Location>) {
        this._mapSubject$ = mapSubject$;
    }

    get mapSubject$() {
        return this._mapSubject$;
    }
}