import { Route } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';

import { PrivateRouteGuard } from '../guards/private-route.guard';

export const MODULE_ROUTES: Route[] = [
	{
		path: 'profile',
		component: ProfileComponent,
		canActivate: [PrivateRouteGuard],
		children: [
			{ path: '', component: HomeComponent },
			{ path: 'home', component: HomeComponent },
			{ path: 'logout', component: LogoutComponent },
			// { path: '', redirectTo: 'home', pathMatch: 'full' }
		],
	},
];

export const MODULE_COMPONENTS = [ProfileComponent, HomeComponent, LogoutComponent];
