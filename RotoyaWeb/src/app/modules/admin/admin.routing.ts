import { Routes } from '@angular/router';
import { UserRouteAccessService } from './../../auth/user-route-access-service';
import { Authorities } from './../../constants/auth.constants';
import { BookManagerComponent } from './book-manager/book-manager.component';
import { RequestCoOperateManagerComponent } from './request-co-operate-manager/request-co-operate-manager.component';
import { AccountComponent } from './account/account.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentInfoComponent } from './payment/payment-info/payment-info.component';
import { StatisticProviderComponent } from './statistic-provider/statistic-provider.component';
import { EquipmentComponent } from './equipment/equipment.component';

export const adminRoutes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sport-center'
    },
    {
        path: 'sport-center',
        data: {
            authorities: [Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        loadChildren: () => import('./sport-center/sport-center.module').then(m => m.SportCenterModule)
    },
    {
        path: 'book-manager',
        data: {
            authorities: [Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        component: BookManagerComponent
    },
    {
        path: 'request-co-operate-manager',
        data: {
            authorities: [Authorities.ADMIN]
        },
        canActivate: [UserRouteAccessService],
        component: RequestCoOperateManagerComponent
    },
    {
        path: 'account',
        data: {
            authorities: [Authorities.ADMIN]
        },
        canActivate: [UserRouteAccessService],
        component: AccountComponent
    },
    {
        path: 'payment',
        data: {
            authorities: [Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        component: PaymentComponent
    },
    {
        path: 'payment/:orderId',
        data: {
            authorities: [Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        component: PaymentInfoComponent
    },
    {
        path: 'statistic-provider',
        data: {
            authorities: [Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        component: StatisticProviderComponent
    },
    {
        path: 'equipment',
        data: {
            authorities: [Authorities.PROVIDER]
        },
        canActivate: [UserRouteAccessService],
        component: EquipmentComponent
    }
];
