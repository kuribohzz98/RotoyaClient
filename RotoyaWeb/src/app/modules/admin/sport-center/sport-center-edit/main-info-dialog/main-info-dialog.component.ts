import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICity } from './../../../../../shared/models/address';
import { AddressService } from './../../../../../shared/service/address.service';
import { DialogAcceptComponent } from './../../../../../shared/components/dialog-accept/dialog-accept.component';
import { SportCenterService } from './../../../../../service/sport-center.service';
import { ISportCenter } from './../../../../../shared/models/sport-center';
import { converTimeToNumber, convertNumberToTime } from './../../../../../helper/util/time';
import { filterObjectChange } from './../../../../../helper/util/common';
import { NotifyService } from './../../../../../shared/service/notify.service';

export interface MainInfoEditDialogData {
    id: number;
    name: string;
    city: string;
    district: string;
    commune: string;
    address: string;
    timeOpen: number;
    timeClose: number;
}

@Component({
    selector: 'app-main-info-edit-dialog',
    templateUrl: './main-info-dialog.component.html',
    styles: [`
        .field {margin-bottom: 20px;}
    `]
})
export class MainInfoEditDialogComponent implements OnInit, OnDestroy {

    cities: ICity[] = [] as ICity[];
    districts: ICity[] = [] as ICity[];
    wards: ICity[] = [] as ICity[];
    formEditInfo: FormGroup;
    oldData: MainInfoEditDialogData;

    private _destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(
        public dialogRef: MatDialogRef<MainInfoEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: MainInfoEditDialogData,
        private readonly dialog: MatDialog,
        private readonly addressService: AddressService,
        private readonly fb: FormBuilder,
        private readonly sportCenterService: SportCenterService,
        private readonly notifyService: NotifyService
    ) { }

    ngOnInit(): void {
        this.oldData = {...this.data};
        this.formEditInfo = this.fb.group({
            name: [this.data.name || '', Validators.required],
            city: ['', Validators.required],
            district: ['', Validators.required],
            commune: ['', Validators.required],
            address: [this.data.address || ''],
            timeOpen: [convertNumberToTime(this.data.timeOpen) || '', Validators.required],
            timeClose: [convertNumberToTime(this.data.timeClose) || '', Validators.required]
        })
        this.initPackageAddress();
    }

    initPackageAddress(): void {
        const subjectChange$ = this.addressService.initPackage(
            this.formEditInfo,
            this._destroy$
        );

        subjectChange$.pipe(takeUntil(this._destroy$)).subscribe(data => {
            if (data.cities) {
                this.cities = data.cities;
                if (this.data.city) {
                    const city = this.cities.find(city => city.name == this.data.city);
                    if (city) {
                        this.formEditInfo.controls.city.patchValue(city.id);
                        this.data.city = null;
                    }
                }
            }
            if (data.districts) {
                this.districts = data.districts;
                if (this.data.district) {
                    const district = this.districts.find(district => district.name == this.data.district);
                    if (district) {
                        this.formEditInfo.controls.district.patchValue(district.id);
                        this.data.district = null;
                    }
                }
            }
            if (data.wards) {
                this.wards = data.wards;
                if (this.data.commune) {
                    const ward = this.wards.find(ward => ward.name == this.data.commune);
                    if (ward) {
                        this.formEditInfo.controls.commune.patchValue(ward.id);
                        this.data.commune = null;
                    }
                }
            }
        })
    }

    onSubmit(): void {
        if (this.formEditInfo.invalid) return;
        const dialogRef = this.dialog.open(DialogAcceptComponent, {
            width: '350px',
            data: { title: 'Xác nhận' }
        });

        dialogRef.afterClosed().pipe(takeUntil(this._destroy$))
            .subscribe(result => {
                if (!result) return;
                const sportCenterData = {} as ISportCenter;
                sportCenterData.id = this.data.id;
                sportCenterData.city = this.cities.find(city => city.id == +this.formEditInfo.value.city).name;
                sportCenterData.district = this.districts.find(district => district.id == +this.formEditInfo.value.district).name;
                sportCenterData.commune = this.wards.find(ward => ward.id == +this.formEditInfo.value.commune).name;
                sportCenterData.address = this.formEditInfo.value.address;
                sportCenterData.timeOpen = converTimeToNumber(this.formEditInfo.value.timeOpen);
                sportCenterData.timeClose = converTimeToNumber(this.formEditInfo.value.timeClose);
                const body = filterObjectChange(this.oldData, sportCenterData);
                if (!body) {
                    this.notifyService.showNotifyWarning('Bạn chưa thay đổi gì');
                    return;
                }
                this.sportCenterService.put({...body, id: this.data.id})
                    .subscribe(res => {
                        if (res.message == 'success') {
                            this.dialogRef.close(true);
                            return;
                        }
                    })
            });
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}