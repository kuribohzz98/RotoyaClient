import { mergeMap } from 'rxjs/operators';
import { FormControl, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ISport } from './../../../shared/models/sport';
import { SportCenterEquipmentService } from './../../../service/sport-center-equipment.service';
import { SportCenterService } from './../../../service/sport-center.service';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { ISportCenterEquipment } from './../../../shared/models/sport-center-equipment';
import { environment } from './../../../../environments/environment.prod';
import { NotifyService } from './../../../shared/service/notify.service';
import { CreateEditEquipmentComponent } from './create-edit-equipment/create-edit-equipment.component';

@Component({
    selector: 'app-equipment',
    templateUrl: './equipment.component.html'
})
export class EquipmentComponent implements OnInit {
    sports: ISport[] = [];
    sportControl: FormControl;
    scEquipments: ISportCenterEquipment[] = [];
    host: string = environment.serverUrl;

    constructor(
        private readonly adminLayoutService: AdminLayoutService,
        private readonly sportCenterService: SportCenterService,
        private readonly sportCenterEquipmentService: SportCenterEquipmentService,
        private readonly notifyService: NotifyService,
        private readonly dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.initSCEquipment();
    }

    initSCEquipment(): void {
        this.sportCenterService.getSportCenter(+(this.adminLayoutService.sportCenterSelected || {}).id)
            .pipe(mergeMap(sportCenter => {
                this.sports = sportCenter.sports;
                this.sportControl = new FormControl(this.sports[0].id);
                return this.sportCenterEquipmentService.get({ sportId: this.sports[0].id, sportCenterId: sportCenter.id })
            }))
            .subscribe((scEquipments: ISportCenterEquipment[]) => {
                this.scEquipments = scEquipments;
            })
    }

    deleteEquipment(index: number): void {
        this.sportCenterEquipmentService.put({ id: this.scEquipments[index].id || 0, isDelete: true })
            .subscribe(res => {
                if (res.message == 'success') {
                    this.notifyService.showNotifySuccess('Xóa thành công');
                    this.initSCEquipment();
                    return;
                }
                this.notifyService.showNotifyDanger('Xóa thất bại');
            })
    }

    createEdit(index?: number) {
        if (!index && index != 0) {
            const dialogRef = this.dialog.open(CreateEditEquipmentComponent, {
                width: '700px',
                data: {
                    sportCenterId: this.adminLayoutService.sportCenterSelected.id,
                    sportId: this.sportControl.value
                }
            });
            dialogRef.afterClosed().subscribe(res => {
                if (res) {
                    this.notifyService.showNotifySuccess('Thêm dụng cụ thể thao thành công');
                    this.initSCEquipment();
                }
            })
            return;
        }
        const dialogRef = this.dialog.open(CreateEditEquipmentComponent, {
            width: '700px',
            data: {
                scEquipment: this.scEquipments[index],
                sportCenterId: this.adminLayoutService.sportCenterSelected.id,
                sportId: this.sportControl.value
            }
        });
        dialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.notifyService.showNotifySuccess('Sửa dụng cụ thể thao thành công');
                this.initSCEquipment();
            }
        })
    }
}