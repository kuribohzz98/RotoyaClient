import { PageEvent } from '@angular/material/paginator';
import { Pagination, PageSizeOption } from './../../../shared/models/page.model';
import { mergeMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { RequestCoOperateService } from './../../../service/request-co-operate.service';
import { IRequestCoOperate } from './../../../shared/models/request-co-operate';
import { NotifyService } from './../../../shared/service/notify.service';

@Component({
    selector: 'app-request-co-operate-manager',
    templateUrl: './request-co-operate-manager.component.html'
})
export class RequestCoOperateManagerComponent implements OnInit {
    requestcoOperate: IRequestCoOperate[] = [];
    pageData: Pagination = new Pagination();
    pageSizeOptions: number[] = new PageSizeOption().pageSize;

    constructor(
        private readonly requestCoOperateService: RequestCoOperateService,
        private readonly notifyService: NotifyService
    ) { }

    ngOnInit(): void {
        this.pageData.pageSize = this.pageSizeOptions[0];
        this.initCoOperate();
    }

    initCoOperate(): void {
        this.requestCoOperateService.get({
            status: 'WAITTING',
            page: this.pageData.currentPage,
            limit: this.pageData.pageSize
        }).subscribe((data: IRequestCoOperate[]) => {
            this.requestcoOperate = data;
        })
    }


    onPageChange($event: PageEvent): void {
        this.pageData.currentPage = $event.pageIndex + 1;
        this.pageData.pageSize = $event.pageSize;
        this.initCoOperate();
    }

    onApprove(index: number): void {
        const operate = { ...this.requestcoOperate[index] };
        operate.status = 'APPROVED';
        this.requestCoOperateService.put(operate)
            .pipe(
                mergeMap(res => {
                    if (res.message == 'success') return this.requestCoOperateService.get({ status: 'WAITTING' });
                    return of(null)
                })
            ).subscribe(res => {
                if (res) {
                    this.requestcoOperate = res;
                    this.notifyService.showNotifySuccess(`Xác nhận thành công`);
                }
            }, err => {
                this.notifyService.showNotifyDanger(`Đã có lỗi xả ra`);
            })
    }

    onReject(index: number): void {
        const operate = { ...this.requestcoOperate[index] };
        operate.status = 'REJECTED';
        this.requestCoOperateService.put(operate)
            .pipe(
                mergeMap(res => {
                    if (res.message == 'success') return this.requestCoOperateService.get({ status: 'WAITTING' });
                    return of(null)
                })
            ).subscribe(res => {
                if (res) {
                    this.requestcoOperate = res;
                    this.notifyService.showNotifySuccess(`Từ chối thành công`);
                }
            }, err => {
                this.notifyService.showNotifyDanger(`Đã có lỗi xả ra`);
            })
    }
}