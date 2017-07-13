
import { Component, OnInit } from '@angular/core';


import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';



@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	form: FormGroup;
	username = new FormControl('', Validators.required);
	code = new FormControl('', Validators.required);
	password = new FormControl('', Validators.required);

	public codeSent: boolean = false;

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
			password: this.password,
		});
	}

	ngOnInit() {}

	createNewPassword(ev, confirmObject: {username: string, code: string|number, password: string}) {
		console.log(confirmObject.username, confirmObject.code, ev);

		this.errorMessage = undefined;
		this.loading = true;

		// @TODO turn this into a promise based function
		return this.auth.confirmNewPassword(confirmObject.username, confirmObject.code.toString(), confirmObject.password)
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
    // return this.auth.resendCode(username)
    return this.auth.forgotPassword(username)
    .then(res => {
      console.log(res);
	  	this.errorMessage = 'New confirmation code sent!';
  		this.codeSent = true;
  		this.loading = false;
    })
    .catch(e => {
	  	this.errorMessage = e.message;
  		this.loading = false;
    });
  }


}
