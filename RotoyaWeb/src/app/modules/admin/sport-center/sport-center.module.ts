import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from './../../../shared/shared.module';
import { sportCenterRoutes } from './sport-center.routing';
import { SportCenterComponent } from './sport-center.component';
import { SportCenterMapComponent } from './map/sport-center-map.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    imports: [
        RouterModule.forChild(sportCenterRoutes),
        CommonModule,
        SharedModule,
        MatDividerModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule
    ],
    declarations: [
        SportCenterComponent,
        SportCenterMapComponent
    ],
})
export class SportCenterModule { }
