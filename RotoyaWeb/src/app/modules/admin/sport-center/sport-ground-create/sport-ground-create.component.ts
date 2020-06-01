import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SportGroundCreateAutomaticComponent, SportGroundCreateAutomaticData } from './sport-ground-create-automatic/sport-ground-create-automatic.component';
import { AdminLayoutService } from './../../../../shared/service/admin-layout.service';
import { SportService } from './../../../../service/sport.service';
import { ISportGroundTimeSlot } from './../../../../shared/models/time-slot';
import { ISportCenter } from './../../../../shared/models/sport-center';
import { ISport } from './../../../../shared/models/sport';
import { caculatorTime, convertTimeToNumber, getTime, convertNumberToTime } from './../../../../helper/util/time';
import { SportGroundTimeSlotService } from './../../../../service/time-slot.service';
import { SportGroundService } from './../../../../service/sport-ground.service';
import { ISportGround } from './../../../../shared/models/sport-ground';
import { NotifyService } from './../../../../shared/service/notify.service';

@Component({
    selector: 'app-sport-ground-create',
    templateUrl: './sport-ground-create.component.html',
    styles: [`
        .field {margin-bottom: 20px;}
        .load-image {display: none;}
        ::ng-deep .primary-tooltip {
            color: white !important;
        }
    `]
})
export class SportGroundCreateComponent implements OnInit {
    sports: ISport[] = [];
    formCreate: FormGroup;
    formSlots: FormGroup;
    sportCenter: ISportCenter;
    timeSlots: ISportGroundTimeSlot[] = [];
    slots: any[] = [];

    constructor(
        private readonly dialog: MatDialog,
        private readonly adminLayoutService: AdminLayoutService,
        private readonly fb: FormBuilder,
        private readonly sportService: SportService,
        private readonly sportGroundService: SportGroundService,
        private readonly timeSlotService: SportGroundTimeSlotService,
        private readonly notifyService: NotifyService,
        private readonly router: Router
    ) { }

    ngOnInit(): void {
        this.sportCenter = this.adminLayoutService.sportCenterSelected;
        console.log(this.adminLayoutService.sportCenterSelected);
        this.formCreate = this.fb.group({
            name: ['', Validators.required],
            quantity: [1, Validators.required],
            sport: ['', Validators.required]
        })
        this.formSlots = this.fb.group({});
        this.sportService.get().subscribe((sports: ISport[]) => {
            this.sports = sports;
        })
    }

    openDialogAddSlotAutomatic(): void {
        const dialogRef = this.dialog.open(SportGroundCreateAutomaticComponent, {
            width: '400px'
        });
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.addSlotAutomatic(data as SportGroundCreateAutomaticData)
        })
    }

    addSlotAutomatic(data: SportGroundCreateAutomaticData): void {
        this.formSlots = this.fb.group({});
        this.slots.length = 0;
        const { timeOpen, timeClose } = this.adminLayoutService.sportCenterSelected;
        const timeOfSlot = getTime(convertTimeToNumber(data.time));
        const timeOfWait = getTime(convertTimeToNumber(data.timeWait));
        console.log(timeOfSlot, timeOfWait);
        for (let i = 0; i >= 0; i++) {
            const startTime = caculatorTime(convertNumberToTime(timeOpen), i * (timeOfSlot + timeOfWait));
            const endTime = caculatorTime(startTime, timeOfSlot);
            if (convertTimeToNumber(endTime) > timeClose || convertTimeToNumber(endTime) < timeOpen) break;
            this.addSlot(startTime, endTime, data.price);
        }
    }

    addSlot(startTime?: string, endTime?: string, price?: number): void {
        this.formSlots.addControl(`slot_${this.slots.length}`, this.fb.group({
            startTime: [startTime || '', Validators.required],
            endTime: [endTime || '', Validators.required],
            price: [price || 0, Validators.required]
        }));
        this.slots.length++;
    }

    removeSlot(index): void {
        const length = this.slots.length;
        this.slots.length--;
        this.formSlots.removeControl(`slot_${index}`);
        for (let i = index + 1; i < length; i++) {
            const control = this.formSlots.controls[`slot_${i}`];
            this.formSlots.removeControl(`slot_${i}`);
            this.formSlots.addControl(`slot_${i - 1}`, control);
        }
    }

    onSubmit(): void {
        if (this.formCreate.invalid || this.formSlots.invalid) return;
        const sportGroundData = {} as ISportGround;
        sportGroundData.sportCenterId = this.adminLayoutService.sportCenterSelected.id;
        sportGroundData.name = this.formCreate.value.name;
        sportGroundData.quantity = this.formCreate.value.quantity;
        sportGroundData.sportId = this.formCreate.value.sport;
        this.sportGroundService.post(sportGroundData)
            .pipe(
                mergeMap(res => {
                    if (res.message == 'success' && res.id) {
                        let timeSlotDatas = [] as ISportGroundTimeSlot[];
                        for (let i = 0; i < this.slots.length; i++) {
                            const timeSlotData = {} as ISportGroundTimeSlot;
                            timeSlotData.startTime = convertTimeToNumber(this.formSlots.value[`slot_${i}`].startTime);
                            timeSlotData.endTime = convertTimeToNumber(this.formSlots.value[`slot_${i}`].endTime);
                            timeSlotData.price = this.formSlots.value[`slot_${i}`].price;
                            timeSlotData.sportGroundId = res.id;
                            timeSlotDatas = [...timeSlotDatas, timeSlotData];
                        }
                        return this.timeSlotService.createMany(timeSlotDatas);
                    }
                    return of(null)
                })
            )
            .subscribe(res => {
                if (res && res.message == 'success') {
                    this.notifyService.showNotifySuccess('Thêm sân thành công');
                    this.router.navigate(['manager/sport-center']);
                    return;
                }
                this.notifyService.showNotifyDanger('Đã có lỗi xảy ra. Vui lòng thử lại');
            })
    }
}