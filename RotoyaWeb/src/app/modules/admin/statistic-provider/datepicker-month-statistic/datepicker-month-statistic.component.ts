import { FormControl } from '@angular/forms';
import { OnInit, Component, Input } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-datepicker-month-statistic',
    templateUrl: './datepicker-month-statistic.component.html',
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ]
})
export class DatePickerMonthStatisticComponent implements OnInit {
    @Input() minDate: Date;
    @Input() formControlDate: FormControl;
    @Input() yearSelected: any;
    @Input() monthSelected: any;
    
    constructor() {}
    ngOnInit(): void {
        
    }
}