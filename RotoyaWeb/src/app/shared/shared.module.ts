import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConvertNumberToTime } from './pipes/convert-number-time.pipe';
import { ConvertDatetimeToDate } from './pipes/convert-date.pipe';
import { TableEmptyComponent } from './components/table-empty/table-empty.component';

@NgModule({
    imports: [

    ],
    declarations: [
        SpinnerComponent,
        ConvertNumberToTime,
        ConvertDatetimeToDate,
        TableEmptyComponent
    ],
    exports: [
        SpinnerComponent,
        ConvertNumberToTime,
        ConvertDatetimeToDate,
        TableEmptyComponent
    ]
})
export class SharedModule { }
