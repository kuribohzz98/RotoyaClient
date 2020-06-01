import { SportGroundCreateComponent } from './sport-ground-create/sport-ground-create.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from './../../../shared/shared.module';
import { sportCenterRoutes } from './sport-center.routing';
import { SportCenterComponent } from './sport-center.component';
import { SportCenterMapComponent } from './map/sport-center-map.component';
import { SportCenterCreateComponent } from './sport-center-create/sport-center-create.component';
import { MainInfoEditDialogComponent } from './sport-center-edit/main-info-dialog/main-info-dialog.component';
import { SportGroundCreateAutomaticComponent } from './sport-ground-create/sport-ground-create-automatic/sport-ground-create-automatic.component';

@NgModule({
    imports: [
        RouterModule.forChild(sportCenterRoutes),
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        MatDividerModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatStepperModule,
        MatDialogModule,
        MatTooltipModule
    ],
    declarations: [
        SportCenterComponent,
        SportCenterMapComponent,
        SportCenterCreateComponent,
        MainInfoEditDialogComponent,
        SportGroundCreateComponent,
        SportGroundCreateAutomaticComponent
    ]
})
export class SportCenterModule { }
