import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ComponentsModule } from './../components/components.module';
import { LayoutAdminComponent } from './layout-admin/layout-admin.component';
import { LayoutGuestComponent } from './layout-guest/layout-guest.component';
import { routes } from './layout.routing';
import { AuthModule } from './../auth/auth.module';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ComponentsModule,
        CommonModule,
        AuthModule
    ],
    declarations: [
        LayoutAdminComponent,
        LayoutGuestComponent
    ]
})
export class LayoutModule { }
