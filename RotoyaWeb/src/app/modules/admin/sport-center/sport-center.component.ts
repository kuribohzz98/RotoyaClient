import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { takeUntil, filter, mergeMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { NotifyService } from './../../../shared/service/notify.service';
import { environment } from './../../../../environments/environment.prod';
import { SportCenterService } from '../../../service/sport-center.service';
import { ISportCenterFull } from './../../../shared/models/sport-center';
import { SportCenterComponentService } from './sport-center-component.service';
import { MainInfoEditDialogComponent, MainInfoEditDialogData } from './sport-center-edit/main-info-dialog/main-info-dialog.component';
import { UploadFileService } from './../../../shared/service/file-upload.service';

@Component({
    selector: 'app-sport-center',
    templateUrl: './sport-center.component.html',
    styles: [`
        .load-image {display: none;}
        ::ng-deep .primary-tooltip {
            color: white !important;
        }
    `]
})
export class SportCenterComponent implements OnInit, OnDestroy {
    _destroy$: Subject<boolean> = new Subject();

    sportCenter: ISportCenterFull;
    isChangeNameSportGround: boolean[] = [];
    isChangeQuantitySportGround: boolean[] = [];
    isEditMap: boolean = false;
    isEditAvatar: boolean = false;
    host: string = environment.serverUrl;

    avatarUpload: string;
    isLoadImage: boolean = false;
    fileUpload: File;

    constructor(
        private readonly sportCenterService: SportCenterService,
        private readonly notifyService: NotifyService,
        private readonly sportCenterComponentService: SportCenterComponentService,
        private readonly adminLayoutService: AdminLayoutService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly uploadFileService: UploadFileService
    ) { }

    ngOnInit(): void {
        const { sportCenters } = this.adminLayoutService;
        if (sportCenters && sportCenters.length) {
            this.initSportCenters();
        }
        this.watchMapEditComponent();
        this.watchSportCenterSelected();
    }

    onLoadImage(): void {
        this.isLoadImage = false;
    }

    watchFileData($event: File): void {
        this.fileUpload = $event;
    }

    onFileComplete(data: any): void {
        if (data.success) {
            this.avatarUpload = data.link;
        } else {
            this.notifyService.showNotifyDanger(data.message);
        }
        this.isLoadImage = true;
    }

    cancelEditAvatar(): void {
        this.isEditAvatar = false;
        this.fileUpload = null;
        this.avatarUpload = null;
    }

    submitEditAvatar(): void {
        if (!this.fileUpload) {
            this.notifyService.showNotifyWarning('Bạn chưa chọn file');
            return;
        }
        this.uploadFileService.upload(this.fileUpload)
            .pipe(
                mergeMap(res => {
                    if (res.filename) return this.sportCenterService.put({ id: this.sportCenter.id, avatar: res.filename });
                    return of(null);
                })
            ).subscribe(res => {
                if (res && res.message == 'success') {
                    this.notifyService.showNotifySuccess('Thay ảnh đại diện thành công');
                    this.initSportCenters(true);
                    this.cancelEditAvatar();
                    return;
                }
                this.notifyService.showNotifyDanger('Đã xảy ra lỗi');
            }, error => {
                this.notifyService.showNotifyDanger('Lỗi ' + error.status + ': ' + error.statusText);
                this.cancelEditAvatar();
            })
    }

    openDialog(): void {
        const data = {} as MainInfoEditDialogData;
        data.id = this.sportCenter.id;
        data.name = this.sportCenter.name;
        data.city = this.sportCenter.city;
        data.district = this.sportCenter.district;
        data.commune = this.sportCenter.commune;
        data.address = this.sportCenter.address;
        data.timeOpen = this.sportCenter.timeOpen;
        data.timeClose = this.sportCenter.timeClose;
        const dialogRef = this.dialog.open(MainInfoEditDialogComponent, {
            width: '500px',
            data
        });

        dialogRef.afterClosed().pipe(takeUntil(this._destroy$))
            .subscribe(result => {
                if (result) {
                    this.notifyService.showNotifySuccess('Thay đổi thông tin thành công');
                    this.initSportCenters(true);
                }
            });
    }

    initSportCenters(changeData?: boolean): void {
        this.sportCenterService.getSportCenter(+(this.adminLayoutService.sportCenterSelected || {}).id).subscribe(sportCenter => {
            this.sportCenter = sportCenter;
            console.log(this.sportCenter);
            changeData && this.adminLayoutService.changeOneSportCenter(sportCenter);
            this.initBooleanView(this.sportCenter);
        })
    }

    watchSportCenterSelected(): void {
        this.adminLayoutService.sportCenterSelectedSubject$
            .pipe(
                mergeMap(() => this.sportCenterService.getSportCenter(+this.adminLayoutService.sportCenterSelected.id)),
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

    watchMapEditComponent(): void {
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

    initBooleanView(sportCenter: ISportCenterFull): void {
        this.isChangeNameSportGround = sportCenter.sportGrounds.map(() => false);
        this.isChangeQuantitySportGround = [...this.isChangeNameSportGround];
    }

    openEditMap(): void {
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

    saveEditMap(): void {
        this.isEditMap = !this.isEditMap;
        this.sportCenterComponentService.mapSubject$.next({ save: true });
    }

    createSportCenter(): void {
        this.router.navigate(['/manager/sport-center/create']);
    }

    createSportGround(): void {
        this.router.navigate(['manager/sport-center/create-sport-ground']);
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}