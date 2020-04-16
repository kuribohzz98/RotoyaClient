import { Routes, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AdminLayoutService } from './../shared/service/admin-layout.service';
import { SportCenter } from './../shared/models/sport-center';
import { LayoutAdminComponent } from './layout-admin/layout-admin.component';
import { SportService } from './../service/sport.service';

@Injectable({ providedIn: 'root' })
export class SportCenterResolve implements Resolve<SportCenter[]> {
    constructor(
        private readonly sportService: SportService,
        private readonly adminLayoutService: AdminLayoutService,
        private readonly router: Router
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<SportCenter[]> {
        return this.sportService.getSportCenters({ userId: 1 })
            .pipe(
                filter(sportCenters => !!sportCenters && !!sportCenters.length),
                tap(sportCenters => {
                    this.adminLayoutService.sportCenters = sportCenters;
                    this.adminLayoutService.sportCenterSelected = sportCenters[0];
                    return sportCenters;
                })
            );
    }
}

export const routes: Routes = [
    {
        path: '',
        component: LayoutAdminComponent,
        loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),
        resolve: {
            sportCenters: SportCenterResolve
        }
    }
];
