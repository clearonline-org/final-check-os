import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

declare var AWSCognito: any;
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
    ]
})
export class LoginComponent implements OnInit {

  public loading: boolean;
  public loadingMessage = 'Working...';
  public errorMessage: string;

  form: FormGroup;
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);


  constructor(
    public router: Router,
    public auth: AuthService,
    public fb: FormBuilder
  ) {
    this.form = fb.group({
      'username': this.username,
      'password': this.password
    });
  }

  ngOnInit() {
    $.getScript('/assets/js/material-kit.js');
  }

  loginUser(ev: Event, data: any) {
    console.log(data.username, data.password, ev);

    this.errorMessage = undefined;
    this.loading = true;

    this.auth.loginUser(this.form.value.username, this.form.value.password)
      .then(session => {
        this.loading = false;
        if (!session) {
          console.log(`App: No session found ${new Date()}`);
          this.errorMessage = 'Sorry, User does not exist!';
          return; // not logged in
        }
        console.log(this.auth.session.cognitoSession);
        console.log(`App: Session is ${this.auth.session.cognitoSession.isValid()}`);
        return this.router.navigateByUrl('/dashboard');
      })
      .catch(e => {
        this.loading = false;
        this.errorMessage = e.message || 'Sorry, I cannot log you in!';
        console.error(`App: No session found ${e.message}`);
        console.log(e);
        // same as not logged in
      });


  }

  reset() {
    this.form.reset();
  }

  openLoginModal(ev) {

  }

}
