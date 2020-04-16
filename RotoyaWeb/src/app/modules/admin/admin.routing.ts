import { Routes } from '@angular/router';
import { BookManagerComponent } from './book-manager/book-manager.component';
import { SportCenterComponent } from './sport-center/sport-center.component';

export const adminRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sport-center'
    },
    {
        path: 'sport-center',
        loadChildren: () => import('./sport-center/sport-center.module').then(m => m.SportCenterModule)
    },
    {
        path: 'book-manager',
        component: BookManagerComponent
    }
];
