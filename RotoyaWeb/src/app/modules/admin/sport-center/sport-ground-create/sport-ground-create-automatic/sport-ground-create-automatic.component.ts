import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface SportGroundCreateAutomaticData {
    time: string;
    timeWait: string;
    price: number;
}

@Component({
    selector: 'app-sport-ground-create-automatic',
    templateUrl: './sport-ground-create-automatic.component.html',
    styles: [`
        .field {margin-bottom: 20px;}
    `]
})
export class SportGroundCreateAutomaticComponent implements OnInit {

    formAutomatic: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<SportGroundCreateAutomaticComponent>,
        private readonly fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.formAutomatic = this.fb.group({
            time: ['', Validators.required],
            timeWait: ['', Validators.required],
            price: [0, Validators.required]
        })
    }

    onSubmit(): void {
        if (this.formAutomatic.invalid) return;
        this.dialogRef.close(this.formAutomatic.value);
    }
}