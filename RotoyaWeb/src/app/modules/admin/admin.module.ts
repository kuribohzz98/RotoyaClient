import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from './../../shared/shared.module';
import { adminRoutes } from './admin.routing';
import { BookManagerComponent } from './book-manager/book-manager.component';
import { RequestCoOperateManagerComponent } from './request-co-operate-manager/request-co-operate-manager.component';

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes),
        CommonModule,
        SharedModule,
        MatDividerModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatTooltipModule
    ],
    declarations: [
        BookManagerComponent,
        RequestCoOperateManagerComponent
    ],
})
export class AdminModule { }
