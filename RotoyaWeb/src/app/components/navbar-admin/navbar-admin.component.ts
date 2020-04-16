import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ROUTES } from '../sidebar/sidebar.component';
import { AdminLayoutService } from './../../shared/service/admin-layout.service';
import { SportCenter } from './../../shared/models/sport-center';

@Component({
    selector: 'app-navbar-admin',
    templateUrl: './navbar-admin.component.html'
})
export class NavbarAdminComponent implements OnInit, OnDestroy {
    private listTitles: any[];
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    sportCenters: SportCenter[];
    sportCenterControl: SportCenter;

    private _destroy$: Subject<boolean> = new Subject();

    constructor(
        private element: ElementRef,
        private router: Router,
        private readonly adminLayoutService: AdminLayoutService
    ) {
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.sportCenters = this.adminLayoutService.sportCenters;
        this.sportCenterControl = this.adminLayoutService.sportCenterSelected;
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
        this.watchSportCenters();
    }

    onchange(event: MatSelectChange) {
        this.adminLayoutService.sportCenterSelected = event.value;
        this.adminLayoutService.sportCenterSelectedSubject$.next(event.value);
    }

    watchSportCenters() {
        this.adminLayoutService.sportCenterSubject$
            .pipe(takeUntil(this._destroy$)).subscribe(() => {
                this.sportCenters = this.adminLayoutService.sportCenters;
            })
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    ngOnDestroy() {
        this._destroy$.next(true);
        this._destroy$.complete();
    }

    // getTitle() {
    //     var titlee = this.location.prepareExternalUrl(this.location.path());
    //     if (titlee.charAt(0) === '#') {
    //         titlee = titlee.slice(1);
    //     }

    //     for (var item = 0; item < this.listTitles.length; item++) {
    //         if (this.listTitles[item].path === titlee) {
    //             return this.listTitles[item].title;
    //         }
    //     }
    //     return 'Dashboard';
    // }
}