import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './../../auth/login/login.component';
import { UserRouteAccessService } from './../../auth/user-route-access-service';
import { CoOperateComponent } from './co-operate/co-operate.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { Authorities } from 'src/app/constants/auth.constants';

export const guestRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'request-co-operate',
        component: CoOperateComponent
    },
    {
        path: 'change-password',
        data: {
            authorities: [Authorities.PROVIDER, Authorities.ADMIN]
        },
        canActivate: [UserRouteAccessService],
        component: ChangePasswordComponent
    }
];
