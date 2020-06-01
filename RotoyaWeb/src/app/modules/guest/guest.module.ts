import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from './../../shared/shared.module';
import { guestRoutes } from './guest.routing';
import { CoOperateComponent } from './co-operate/co-operate.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeComponent } from './home/home.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

@NgModule({
    imports: [
        RouterModule.forChild(guestRoutes),
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        SharedModule
    ],
    declarations: [
        HomeComponent,
        CoOperateComponent,
        ChangePasswordComponent,
        ForgetPasswordComponent
    ],
})
export class GuestModule { }
