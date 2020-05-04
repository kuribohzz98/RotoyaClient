import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
    title: string;
    content: string;
}

@Component({
    selector: 'app-dialog-accept',
    templateUrl: './dialog-accept.component.html'
})
export class DialogAcceptComponent {
    constructor(
        public dialogRef: MatDialogRef<DialogAcceptComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) { }
}