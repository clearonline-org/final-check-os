import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApiRequestLogComponent } from './api-request-log/api-request-log.component';
import { ApiRequestComponent } from './api-request/api-request.component';

import { PrivateRouteGuard } from '../guards/private-route.guard';

export const MODULE_ROUTES: Route[] = [
    {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [PrivateRouteGuard],
        canActivateChild: [PrivateRouteGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'applications', component: ApplicationListComponent },
            { path: ':appId/request-log', component: ApiRequestLogComponent },
            { path: ':appId/:id', component: ApiRequestComponent }
            // { path: '', redirectTo: 'home', pathMatch: 'full' }

        ]


    }

];

export const MODULE_COMPONENTS = [
    HomeComponent,
    ApplicationListComponent,
    ApiRequestLogComponent,
    ApiRequestComponent
];
