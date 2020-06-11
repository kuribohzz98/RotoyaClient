import { FormControl } from '@angular/forms';
import { OnInit, Component, Input } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};

@Component({
    selector: 'app-datepicker-year-statistic',
    templateUrl: './datepicker-year-statistic.component.html',
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class DatePickerYearStatisticComponent implements OnInit {
    @Input() minDate: Date;
    @Input() formControlDate: FormControl;
    @Input() yearSelected: any;
    
    constructor() {}
    ngOnInit(): void {
        
    }
}