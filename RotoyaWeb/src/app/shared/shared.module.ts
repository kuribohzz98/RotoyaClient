import { ConvertGenderPipe } from './pipes/convert-gender.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConvertNumberToTimePipe } from './pipes/convert-number-time.pipe';
import { ConvertDatetimeToDatePipe } from './pipes/convert-date.pipe';
import { TableEmptyComponent } from './components/table-empty/table-empty.component';
import { DialogAcceptComponent } from './components/dialog-accept/dialog-accept.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';

@NgModule({
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
        CommonModule
    ],
    declarations: [
        SpinnerComponent,
        ConvertNumberToTimePipe,
        ConvertDatetimeToDatePipe,
        TableEmptyComponent,
        DialogAcceptComponent,
        UploadFileComponent,
        ConvertGenderPipe
    ],
    exports: [
        SpinnerComponent,
        ConvertNumberToTimePipe,
        ConvertDatetimeToDatePipe,
        TableEmptyComponent,
        DialogAcceptComponent,
        UploadFileComponent,
        ConvertGenderPipe
    ]
})
export class SharedModule { }
