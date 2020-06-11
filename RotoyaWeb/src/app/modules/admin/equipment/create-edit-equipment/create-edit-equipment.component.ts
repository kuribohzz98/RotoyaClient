import { SportCenterEquipmentService } from './../../../../service/sport-center-equipment.service';
import { OnInit, Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { mergeMap, concatMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadFileService } from './../../../../shared/service/file-upload.service';
import { NotifyService } from './../../../../shared/service/notify.service';
import { ISportCenterEquipment } from './../../../../shared/models/sport-center-equipment';
import { SportEquipmentService } from './../../../../service/sport-equipment.service';
import { environment } from './../../../../../environments/environment.prod';

export interface CreateEditEquipmentDialogData {
    scEquipment: ISportCenterEquipment;
    sportCenterId: number;
    sportId: number;
}

@Component({
    selector: 'app-create-edit-equipment',
    templateUrl: './create-edit-equipment.component.html'
})
export class CreateEditEquipmentComponent implements OnInit {
    scEquipment: ISportCenterEquipment = {};
    title: string = 'Thêm dụng cụ thể thao';
    formCreateEdit: FormGroup;
    host: string = environment.serverUrl;

    avatarUpload: string;
    isLoadImage: boolean = false;
    fileUpload: File;

    constructor(
        public dialogRef: MatDialogRef<CreateEditEquipmentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CreateEditEquipmentDialogData,
        private readonly uploadFileService: UploadFileService,
        private readonly notifyService: NotifyService,
        private readonly sportEquipmentService: SportEquipmentService,
        private readonly sportCenterEquipmentService: SportCenterEquipmentService,
        private readonly fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.formCreateEdit = this.fb.group({
            name: ['', [Validators.required]],
            price: ['', [Validators.required]],
            quantity: ['', [Validators.required]]
        })
        if (this.data.scEquipment) {
            this.scEquipment = this.data.scEquipment;
            this.title = 'Sửa dụng cụ thể thao';
            this.formCreateEdit.patchValue({
                name: this.scEquipment.name,
                price: this.scEquipment.price,
                quantity: this.scEquipment.quantity
            })
        }
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
        this.fileUpload = null;
        this.avatarUpload = null;
    }

    onSubmit(): void {
        if (this.formCreateEdit.invalid) {
            return;
        }
        if (this.data.scEquipment) {
            let obser = of(null);
            if (this.fileUpload) obser = this.uploadFileService.upload(this.fileUpload);
            obser.pipe(
                mergeMap(res => {
                    if (res && res.filename) return forkJoin([
                        this.sportEquipmentService.put({
                            id: this.scEquipment.sportEquipmentId,
                            image: res.filename,
                            name: this.formCreateEdit.value.name
                        }),
                        this.sportCenterEquipmentService.put({
                            id: this.scEquipment.id,
                            quantity: this.formCreateEdit.value.quantity,
                            price: this.formCreateEdit.value.price
                        })
                    ]);
                    return this.sportCenterEquipmentService.put({
                        id: this.scEquipment.id,
                        quantity: this.formCreateEdit.value.quantity,
                        price: this.formCreateEdit.value.price
                    })
                })
            ).subscribe(res => {
                this.dialogRef.close(true);
            }, error => {
                this.notifyService.showNotifyDanger('Lỗi ' + error.status + ': ' + error.statusText);
            })
            return;
        }
        if (!this.fileUpload) {
            this.notifyService.showNotifyDanger('Bạn chưa thêm ảnh');
            return;
        }
        this.uploadFileService.upload(this.fileUpload)
            .pipe(
                concatMap(res => {
                    if (res.filename) return this.sportEquipmentService.post({
                        image: res.filename,
                        name: this.formCreateEdit.value.name,
                        sportId: this.data.sportId
                    });
                    return of(null);
                }),
                concatMap(res => {
                    if (res) return this.sportCenterEquipmentService.post({
                        quantity: this.formCreateEdit.value.quantity,
                        price: this.formCreateEdit.value.price,
                        sportEquipmentId: res.id,
                        sportCenterId: this.data.sportCenterId
                    });
                    return of(null);
                })
            ).subscribe(res => {
                if (res && res.message == 'success') {
                    this.dialogRef.close(true);
                    return;
                }
                this.notifyService.showNotifyDanger('Đã xảy ra lỗi');
            }, error => {
                this.notifyService.showNotifyDanger('Lỗi ' + error.status + ': ' + error.statusText);
            })
    }
}