import { Routes, Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AdminLayoutService } from './../shared/service/admin-layout.service';
import { ISportCenter } from './../shared/models/sport-center';
import { LayoutAdminComponent } from './layout-admin/layout-admin.component';
import { SportCenterService } from '../service/sport-center.service';
import { LayoutGuestComponent } from './layout-guest/layout-guest.component';
import { Authorities } from './../constants/auth.constants';
import { StorageService } from '../shared/service/storage.service';
import { UserRouteAccessService } from './../auth/user-route-access-service';
import { KeySessionStorage } from '../constants/storage.constants';

@Injectable({ providedIn: 'root' })
export class SportCenterResolve implements Resolve<ISportCenter[]> {
    constructor(
        private readonly sportCenterService: SportCenterService,
        private readonly adminLayoutService: AdminLayoutService,
        private readonly router: Router,
        private readonly storageService: StorageService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ISportCenter[]> {
        const userId = this.storageService.getItemSession(KeySessionStorage.userId);
        if (!userId) {
            this.router.navigate(['/login']);
            return of([]);
        }
        return this.sportCenterService.getSportCenters({ userId: this.storageService.getItemSession(KeySessionStorage.userId) })
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
        component: LayoutGuestComponent,
        loadChildren: () => import('../modules/guest/guest.module').then(m => m.GuestModule)
    },
    {
        path: 'manager',
        data: {
            authorities: [Authorities.ADMIN, Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        component: LayoutAdminComponent,
        loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),
        resolve: {
            sportCenters: SportCenterResolve
        }
    }
];
