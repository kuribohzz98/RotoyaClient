import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ComponentsModule } from './../components/components.module';
import { LayoutAdminComponent } from './layout-admin/layout-admin.component';
import { routes } from './layout.routing';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        ComponentsModule,
        CommonModule
    ],
    declarations: [
        LayoutAdminComponent
    ]
})
export class LayoutModule { }
