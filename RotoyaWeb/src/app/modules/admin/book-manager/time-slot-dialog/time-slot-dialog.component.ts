import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPayment } from './../../../../shared/models/payment';
import { PaymentService } from './../../../../service/payment.service';

export interface TimeSlotDialogData {
    id: number;
    time: number;
}

@Component({
    selector: 'app-time-slot-dialog',
    templateUrl: './time-slot-dialog.component.html',
    styles: [`
        .field {margin-bottom: 20px;}
    `]
})
export class TimeSlotDialogComponent implements OnInit {
    payments: IPayment[] = [];

    constructor(
        public dialogRef: MatDialogRef<TimeSlotDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TimeSlotDialogData,
        private readonly paymentService: PaymentService
    ) { }

    ngOnInit(): void {
        const { id, time } = this.data;
        this.paymentService.getInfoPayment(id, time).subscribe(res => {
            this.payments = res;
        })

    }
}