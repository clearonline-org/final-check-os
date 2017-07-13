/**
* @Author: mars
* @Date:   2017-02-05T21:12:26-05:00
* @Last modified by:   mars
* @Last modified time: 2017-02-10T02:14:44-05:00
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { ApiRequestManagerService } from '../../services/api-request-manager.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
	public loading: boolean;
	public loadingMessage = 'Working...';
	public errorMessage: string;
	public session: SessionService;
	public logoutConfirmed: boolean;

	ngOnInit() {
		return this.userLogout(null);
	}

	constructor(
		private router: Router,
		private auth: AuthService,
		private apiRequestManagerService: ApiRequestManagerService,
		private location: Location
	) {
		this.session = auth.session;
	}

	userLogout(ev) {
		console.log(ev);
		this.errorMessage = undefined;
		this.loading = true;
		this.apiRequestManagerService
			.cleanup()
			.then(() => this.auth.logoutUser())
			.then(result => new Promise(r => setTimeout(() => r(result), 2500)))
			.then(session => {
				this.loading = false;
				this.logoutConfirmed = true;

				console.log('App: Session deleted');
				this.router.navigateByUrl('/login');
			})
			.catch(e => {
				this.loading = false;
				this.errorMessage = e.message || 'Sorry, I cannot log you out!';
				console.error(`App: Error while logging out ${e.message}`);
				console.log(e);
				// same as not logged in
			});
	}
}
