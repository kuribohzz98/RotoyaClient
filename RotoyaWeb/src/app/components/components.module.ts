import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
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
