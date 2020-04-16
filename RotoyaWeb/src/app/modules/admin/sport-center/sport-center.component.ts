import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil, filter, mergeMap } from 'rxjs/operators';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { NotifyService } from './../../../shared/service/notify.service';
import { environment } from './../../../../environments/environment.prod';
import { SportService } from './../../../service/sport.service';
import { SportCenterFull } from './../../../shared/models/sport-center';
import { SportCenterComponentService } from './sport-center-component.service';

@Component({
    selector: 'app-sport-center',
    templateUrl: './sport-center.component.html'
})
export class SportCenterComponent implements OnInit, OnDestroy {
    _destroy$: Subject<boolean> = new Subject();

    sportCenter: SportCenterFull;
    isChangeNameSportGround: boolean[] = [];
    isChangeQuantitySportGround: boolean[] = [];
    isEditMap: boolean = false;
    host: string = environment.serverUrl;


    constructor(
        private readonly sportService: SportService,
        private readonly notifyService: NotifyService,
        private readonly sportCenterComponentService: SportCenterComponentService,
        private readonly adminLayoutService: AdminLayoutService
    ) { }

    ngOnInit() {
        this.sportService.getSportCenter(+(this.adminLayoutService.sportCenterSelected || {}).id || 1).subscribe(sportCenter => {
            this.sportCenter = sportCenter;
            console.log(this.sportCenter);
            this.initBooleanView(this.sportCenter);
        })
        this.watchMapEditComponent();
        
        this.watchSportCenterSelected();
    }

    watchSportCenterSelected() {
        this.adminLayoutService.sportCenterSelectedSubject$
            .pipe(
                mergeMap(() => this.sportService.getSportCenter(+this.adminLayoutService.sportCenterSelected.id)),
                takeUntil(this._destroy$)
            ).subscribe(sportCenter => {
                this.sportCenter = sportCenter;
                this.sportCenterComponentService.mapSubject$.next({
                    latitude: this.sportCenter.latitude,
                    longitude: this.sportCenter.longitude,
                    reload: true
                })
            })
    }

    watchMapEditComponent() {
        this.sportCenterComponentService.mapSubject$
            .pipe(
                filter(data => data && data.latitude && !!data.longitude && !data.reload),
                takeUntil(this._destroy$)
            ).subscribe(data => {
                console.log(data);
                // if (data.latitude != this.sportCenter.latitude || data.longitude != this.sportCenter.longitude) {
                //network
                this.sportCenter.latitude = data.latitude;
                this.sportCenter.longitude = data.longitude;
                // }
            })
    }

    initBooleanView(sportCenter: SportCenterFull) {
        this.isChangeNameSportGround = sportCenter.sportGrounds.map(() => false);
        this.isChangeQuantitySportGround = [...this.isChangeNameSportGround];
    }

    openEditMap() {
        this.isEditMap = !this.isEditMap;
        if (this.isEditMap) {
            this.notifyService.showNotifyInfo(
                `<div>Vui lòng kéo con trỏ địa điểm trên bản đồ để cập nhật vị trí mới.</div>
                <div><em>Lưu ý: phóng to màn hình sẽ dễ thao tác hơn</em></div>`
            );
            this.sportCenterComponentService.mapSubject$.next(null);
            return;
        }
        this.sportCenterComponentService.mapSubject$.next({ cancel: true });
    }

    saveEditMap() {
        this.isEditMap = !this.isEditMap;
        this.sportCenterComponentService.mapSubject$.next({ save: true });
    }

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}