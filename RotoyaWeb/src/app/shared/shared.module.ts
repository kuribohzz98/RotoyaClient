import { NgModule } from '@angular/core';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConvertNumberToTime } from './pipes/convert-number-time.pipe';

@NgModule({
    imports: [

    ],
    declarations: [
        SpinnerComponent,
        ConvertNumberToTime
    ],
    exports: [
        SpinnerComponent,
        ConvertNumberToTime
    ]
})
export class SharedModule { }
