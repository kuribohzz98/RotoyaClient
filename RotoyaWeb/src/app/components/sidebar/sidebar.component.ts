import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './../../auth/account.service';
import { AuthServerProvider } from './../../auth/auth-jwt.service';
import { Authorities } from './../../constants/auth.constants';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  isLogout?: boolean;
  roles?: string[];
}
export const ROUTES: RouteInfo[] = [
  { path: '/manager/sport-center', title: 'Trung tâm thể thao', icon: 'dashboard', class: '', roles: [Authorities.PROVIDER] },
  { path: '/manager/book-manager', title: 'Quản lý đặt sân', icon: 'book', class: '', roles: [Authorities.PROVIDER] },
  { path: '/manager/request-co-operate-manager', title: 'Yêu cầu hợp tác', icon: 'layers', class: '', roles: [Authorities.ADMIN] },
  { path: '/manager/account', title: 'Quản lý tài khoản', icon: 'person_outline', class: '', roles: [Authorities.ADMIN] },
  { path: '/manager/payment', title: 'Quản lý hóa đơn', icon: 'payment', class: '', roles: [Authorities.PROVIDER] },
  { path: '/manager/equipment', title: 'Dụng cụ thể thao', icon: 'local_dining', class: '', roles: [Authorities.PROVIDER] },
  { path: '/manager/statistic-provider', title: 'Thống kê', icon: 'assessment', class: '', roles: [Authorities.PROVIDER] },
  { path: '/logout', title: 'Đăng xuất', icon: 'forward', class: 'logout', isLogout: true }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(
    private readonly router: Router,
    private readonly authServerProvider: AuthServerProvider,
    private readonly accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu(): boolean {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  acceptView(roles?: string[]): boolean {
    if (!roles) return true;
    return this.accountService.hasAnyAuthority(roles);
  }

  logout(): void {
    this.authServerProvider.logout();
    this.router.navigate(['']);
  }
}
