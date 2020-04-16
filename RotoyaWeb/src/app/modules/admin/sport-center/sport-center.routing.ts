import { Routes } from '@angular/router';
import { SportCenterMapComponent } from './map/sport-center-map.component';
import { SportCenterComponent } from './sport-center.component';

export const sportCenterRoutes: Routes = [
    {
        path: '',
        component: SportCenterComponent
    },
    {
        path: 'map-edit',
        component: SportCenterMapComponent
    }
];
