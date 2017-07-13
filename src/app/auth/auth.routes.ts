import { Route } from '@angular/router';
import { AuthComponent } from './auth.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

import { PublicRouteGuard } from '../guards/public-route.guard';

export const MODULE_ROUTES: Route[] = [
    {
        path: '', component: AuthComponent,
        canActivate: [PublicRouteGuard],
        children: [
            { path: '', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'confirm', component: ConfirmComponent },
            { path: 'reset-password', component: ResetPasswordComponent }
            // { path: '', redirectTo: 'home', pathMatch: 'full' }
        ]
    }

];

export const MODULE_COMPONENTS = [
    RegisterComponent,
    LoginComponent,
    ConfirmComponent,
    HomeComponent
];
