import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
	selector: 'app-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
	form: FormGroup;
	username = new FormControl('', Validators.required);
	code = new FormControl('', Validators.required);

	public loading: boolean;
	public loadingMessage = 'Working...';
	public errorMessage: string;

	public session: SessionService;

	constructor(
    public router: Router,
    public auth: AuthService,
    public fb: FormBuilder) {
		this.session = auth.session;
		this.form = fb.group({
			username: this.username,
			code: this.code,
		});
	}

	ngOnInit() {}

	confirmUser(ev, confirmObject: {username: string, code: string|number}) {
		console.log(confirmObject.username, confirmObject.code, ev);

		this.errorMessage = undefined;
		this.loading = true;

		// @TODO turn this into a promise based function
		return this.auth.confirmUser(confirmObject.username, confirmObject.code)
    .then(res => {
      // @TODO what to do with res?
  		this.loading = false;
      return setTimeout(() => this.router.navigateByUrl('/login'), 300);
    })
    .catch(e => {
	  	this.errorMessage = e.message;
  		this.loading = false;
    });
	}

	requestNewCode(ev, username: string) {
		this.loading = true;
    return this.auth.resendCode(username)
    .then(res => {
      console.log(res);
	  	this.errorMessage = 'New confirmation code sent!';
  		this.loading = false;
    })
    .catch(e => {
	  	this.errorMessage = e.message;
  		this.loading = false;
    });
  }


}
