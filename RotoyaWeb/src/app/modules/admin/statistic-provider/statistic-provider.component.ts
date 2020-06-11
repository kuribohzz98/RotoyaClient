import { IBooking } from './../../../shared/models/booking';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import * as _ from 'lodash';
import { PaymentService } from './../../../service/payment.service';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { IPayment } from './../../../shared/models/payment';

@Component({
    selector: 'app-statistic-provider',
    templateUrl: './statistic-provider.component.html'
})
export class StatisticProviderComponent implements OnInit, OnDestroy {
    multiByWeek: any[] = [];
    multiByYear: any[] = [];
    view: any[] = [1000];
    statisticBy: any[] = ['Lợi nhuận', 'Số lượng'];
    viewBy: any[] = ['Tuần', 'Năm'];
    statisticSelectControl: FormControl = new FormControl(0);
    viewBySelectControl: FormControl = new FormControl(0);
    legend: boolean = true;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = true;
    showXAxisLabel: boolean = true;
    xAxisLabel: string = 'Ngày';
    yAxisLabel: string = 'Lợi nhuận (nghìn đồng)';
    timeline: boolean = true;
    currentDate: Date = new Date();
    minDate: Date = new Date(this.currentDate.getFullYear() - 0, 0, 1);
    date: FormControl = new FormControl(moment(this.currentDate));
    title: string = "";
    disabledLeft: boolean = false;
    disabledRight: boolean = false;

    payments: IPayment[] = [];

    private destroy$: Subject<boolean> = new Subject();

    colorScheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };

    constructor(
        private readonly paymentService: PaymentService,
        private readonly adminLayoutService: AdminLayoutService
    ) { }

    ngOnInit(): void {
        this.updateTitle();
        this.viewBySelectControl.valueChanges
            .pipe(takeUntil(this.destroy$)).subscribe(value => {
                this.updateTitle();
                if (value) {
                    this.disabledLeft = true;
                    this.disabledRight = true;
                    return;
                }
                this.disabledLeft = false;
                this.disabledRight = false;
            })
        this.date.valueChanges
            .pipe(takeUntil(this.destroy$)).subscribe(value => {
                this.updateTitle();
            })
        this.statisticSelectControl.valueChanges
            .pipe(takeUntil(this.destroy$)).subscribe(value => {
                this.updateTitle();
                if (!value) {
                    this.yAxisLabel = 'Lợi nhuận (nghìn đồng)';
                    return;
                }
                this.yAxisLabel = 'Số lượng đặt';
            })
    }

    updateTitle(): void {
        const date = this.date.value as moment.Moment;
        let startDate = new Date().getTime();
        let endDate = new Date().getTime();
        if (this.viewBySelectControl.value == 0) {
            this.xAxisLabel = 'Ngày';
            this.title = moment(date).day(1).date() + '-' + moment(date).day(7).format('DD/MM/YYYY');
            startDate = moment(date).day(1).unix() * 1000;
            endDate = moment(date).day(7).unix() * 1000;
        }
        // if (this.viewBySelectControl.value == 1) {
        //     this.title = moment(date).format('MM/YYYY');
        //     startDate = moment(date).startOf('month').unix() * 1000;
        //     endDate = moment(date).endOf('month').unix() * 1000;
        // }
        if (this.viewBySelectControl.value == 1) {
            this.xAxisLabel = 'Tháng';
            this.title = 'Năm ' + moment(date).format('YYYY');
            startDate = moment(date).startOf('year').unix() * 1000;
            endDate = moment(date).endOf('year').unix() * 1000;
        }
        this.initPayment(startDate, endDate);
    }

    initPayment(startDate: number, endDate: number): void {
        this.paymentService.getBySportCenterId(this.adminLayoutService.sportCenterSelected.id, startDate, endDate)
            .subscribe(res => {
                this.payments = res;
                console.log(res);
                this.refactorData();
            })
    }

    refactorData(): void {
        let bookings = [] as IBooking[];
        this.payments.map(payment => {
            payment.bookings.map(booking => bookings.push(booking));
        })
        const data = _(bookings).groupBy(x => [x.sportGroundTimeSlot.sportGround.name, x.bookingDate]).value();
        console.log(data);
        if (this.viewBySelectControl.value == 0) {
            this.multiByWeek = [];
            Object.keys(data).map(key => {
                const key_split = key.split(',');
                const multi = this.multiByWeek.find(multi => multi.name == key_split[0]);
                if (!multi) {
                    this.multiByWeek = [...this.multiByWeek, this.initMultiWeek(key_split[0])];
                    this.multiByWeek[this.multiByWeek.length - 1].series[+new Date(key_split[1]).getDay()].value += !this.statisticSelectControl.value ?
                        data[key].reduce((pre, current) => pre + +current.sportGroundTimeSlot.price, 0) : data[key].length;
                    return;
                }
                multi.series[+new Date(key_split[1]).getDay()].value += !this.statisticSelectControl.value ?
                    data[key].reduce((pre, current) => pre + +current.sportGroundTimeSlot.price, 0) : data[key].length;
            })
            if (!this.multiByWeek.length) this.multiByWeek = [this.initMultiWeek('')];
        }
        // if (this.viewBySelectControl.value == 1) {

        // }
        if (this.viewBySelectControl.value == 1) {
            this.multiByYear = [];
            Object.keys(data).map(key => {
                const key_split = key.split(',');
                const multi = this.multiByYear.find(multi => multi.name == key_split[0]);
                if (!multi) {
                    this.multiByYear = [...this.multiByYear, this.initMultiYear(key_split[0])];
                    this.multiByYear[this.multiByYear.length - 1].series[+new Date(key_split[1]).getMonth()].value += !this.statisticSelectControl.value ?
                        data[key].reduce((pre, current) => pre + +current.sportGroundTimeSlot.price, 0) : data[key].length;
                    return;
                }
                multi.series[+new Date(key_split[1]).getMonth()].value += !this.statisticSelectControl.value ?
                    data[key].reduce((pre, current) => pre + +current.sportGroundTimeSlot.price, 0) : data[key].length;
            })
            if (!this.multiByYear.length) this.multiByYear = [this.initMultiYear('')];
        }
    }

    chosenYearHandler(normalizedYear: moment.Moment, datepicker?: MatDatepicker<moment.Moment>): void {
        const ctrlValue = this.date.value;
        ctrlValue.year(normalizedYear.year());
        this.date.setValue(ctrlValue);
        if (this.viewBySelectControl) datepicker.close();
    }

    chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>): void {
        const ctrlValue = this.date.value as moment.Moment;
        ctrlValue.month(normalizedMonth.month());
        ctrlValue.date(1);
        this.date.setValue(ctrlValue);
        datepicker.close();
    }

    changeTopButton(value: string): void {
        const date = (this.date.value as moment.Moment);
        let date_temp;
        if (value == 'today') {
            date_temp = moment(new Date());
            this.date.setValue(date_temp);
        }
        if (value == 'decrement' && !this.viewBySelectControl.value) {
            date_temp = moment(date).day(-7);
            this.date.setValue(date_temp);
        }
        if (value == 'increment' && !this.viewBySelectControl.value) {
            date_temp = moment(date).day(8);
            this.date.setValue(date_temp);
        }
    }

    onSelect(data): void {
        // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    }

    onActivate(data): void {
        // console.log('Activate', JSON.parse(JSON.stringify(data)));
    }

    onDeactivate(data): void {
        // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
    }

    initMultiWeek(name: string) {
        let series = [];
        for (let i = 0; i < 7; i++) {
            i != 6 && series.push({ value: 0, name: 'Thứ ' + (i + 2) });
            i == 6 && series.push({ value: 0, name: 'Chủ nhật' });
        }
        return {
            name,
            series
        }
    }

    initMultiYear(name: string) {
        let series = [];
        for (let i = 0; i < 12; i++) {
            series.push({ value: 0, name: 'Tháng ' + (i + 1) })
        }
        return {
            name,
            series
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
