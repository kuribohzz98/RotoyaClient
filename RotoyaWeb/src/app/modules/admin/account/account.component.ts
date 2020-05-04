import { Component, OnInit } from '@angular/core';
import { PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AuthServerProvider } from './../../../auth/auth-jwt.service';
import { AccountService } from './../../../auth/account.service';
import { IUser } from './../../../shared/models/user';
import { Pagination, PageSizeOption } from './../../../shared/models/page.model';
import { AccountInfoDialogComponent, AccountInfoDialogData } from './account-info-dialog/account-info-dialog.component';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styles: [`
        .primary-tooltip-info {
        cursor: pointer;
        }
        ::ng-deep .primary-tooltip {
        color: white !important;
        }
  `]
})
export class AccountComponent implements OnInit {
    accounts: IUser[] = [];
    pageData: Pagination = new Pagination();
    pageSizeOptions: number[] = new PageSizeOption().pageSize;

    constructor(
        private readonly accountService: AccountService,
        private readonly authServerProvider: AuthServerProvider,
        private readonly dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.pageData.pageSize = this.pageSizeOptions[0];
        this.initAccount();
    }

    private initAccount(): void {
        this.accountService.get({
            page: this.pageData.currentPage,
            limit: this.pageData.pageSize,
            count: true
        }).subscribe((accounts: [IUser[], number]) => {
            this.accounts = accounts[0];
            this.pageData.totalSize = accounts[1];
        })
    }

    onPageChange($event: PageEvent) {
        this.pageData.currentPage = $event.pageIndex + 1;
        this.pageData.pageSize = $event.pageSize;
        this.initAccount();
    }

    openInfo(index: number): void {
        const data = { ...this.accounts[index].userInfo } as AccountInfoDialogData;
        this.dialog.open(AccountInfoDialogComponent, {
            width: '1000px',
            data
        });
    }
}