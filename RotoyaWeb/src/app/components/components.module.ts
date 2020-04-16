import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from './../shared/shared.module';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [
    SidebarComponent,
    NavbarAdminComponent
  ],
  exports: [
    SidebarComponent,
    NavbarAdminComponent
  ]
})
export class ComponentsModule { }
