import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPayment } from './../../../../shared/models/payment';

export interface AccountInfoDialogData {
    firstName: string;
    lastName: string;
    gender: string;
    phone: number;
    address: string
    email: string
}

@Component({
    selector: 'app-account-info-dialog',
    templateUrl: './account-info-dialog.component.html',
    styles: [`
        .field {margin-bottom: 20px;}
    `]
})
export class AccountInfoDialogComponent {
    payments: IPayment[] = [];

    constructor(
        public dialogRef: MatDialogRef<AccountInfoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AccountInfoDialogData
    ) { }
}