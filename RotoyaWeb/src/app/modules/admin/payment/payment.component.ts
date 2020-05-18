import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageSizeOption, Pagination } from './../../../shared/models/page.model';
import { AdminLayoutService } from './../../../shared/service/admin-layout.service';
import { IPaymentQuery, IPayment } from './../../../shared/models/payment';
import { PaymentService } from './../../../service/payment.service';
import { SortType } from './../../../constants/common.constants';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styles: [`
        .primary-tooltip-info {
        cursor: pointer;
        }
        ::ng-deep .primary-tooltip {
        color: white !important;
        }
    `]
})
export class PaymentComponent implements OnInit, OnDestroy {
    pageData: Pagination = new Pagination();
    pageSizeOptions: number[] = new PageSizeOption().pageSize;
    payments: IPayment[] = [];

    private _destroy$: Subject<boolean> = new Subject();

    constructor(
        private readonly paymentService: PaymentService,
        private readonly adminLayoutService: AdminLayoutService,
        private readonly router: Router
    ) { }
    
    ngOnInit(): void {
        this.pageData.pageSize = this.pageSizeOptions[0];
        this.initPayment();
        this.adminLayoutService.sportCenterSelectedSubject$
        .pipe(takeUntil(this._destroy$)).subscribe(data => {
            this.pageSizeOptions = new PageSizeOption().pageSize;
            this.pageData = new Pagination();
            this.pageData.pageSize = this.pageSizeOptions[0];
            this.initPayment();
        })
    }

    initPayment(): void {
        const query = {} as IPaymentQuery;
        query.sportCenterId = this.adminLayoutService.sportCenterSelected.id;
        query.sort = 'createdAt';
        query.sortType = SortType.DESC;
        query.page = this.pageData.currentPage;
        query.limit = this.pageData.pageSize;
        query.count = true;
        this.paymentService.get(query).subscribe((payments: [IPayment[], number]) => {
            this.payments = payments[0];
            this.pageData.totalSize = payments[1];
        })
    }

    openInfo(index) : void {
        this.router.navigate(['manager/payment/' + this.payments[index].orderId])
    }

    onPageChange($event: PageEvent) {
        this.pageData.currentPage = $event.pageIndex + 1;
        this.pageData.pageSize = $event.pageSize;
        this.initPayment();
    }

    ngOnDestroy(): void {
        this._destroy$.next(true);
        this._destroy$.complete();
    }
}