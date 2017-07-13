
import { Component, OnInit } from '@angular/core';

import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, Validators, FormBuilder } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

import { EmailValidator } from '../../utils/validators/email.validator';
import { EqualPasswordsValidator } from '../../utils/validators/equalPasswords.validator';


declare var $: any;


interface UserModel {
   name: string;
   email: string;
   username: string;
   password: string;
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;



   public name: AbstractControl;
   public email: AbstractControl;
   public password: AbstractControl;
   public repeatPassword: AbstractControl;
   public passwords: FormGroup;




  public loading: boolean;
  public loadingMessage = 'Working...';
  public errorMessage: string;
  public session: SessionService;



  constructor(
        public router: Router,
    public auth: AuthService,
    public fb: FormBuilder
  ) {
    this.session = auth.session;



    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      }, { validator: EqualPasswordsValidator.validate('password', 'repeatPassword') })
    });

    this.name = this.form.controls['name'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];



   }

  ngOnInit() {
    $.getScript('/assets/js/material-kit.js');
  }





  registerUser(ev, userInput) {


      console.log(this.form.value, userInput, ev, this.email.errors);
      if (!this.form.valid) {
        return;
      }
      const password = userInput.passwords.password;
      const username = userInput.email;
      const user = Object.assign({}, userInput, { username, password });

      this.errorMessage = undefined;
      this.loading = true;

     this.auth.registerUser(user)
     .then(session => {
         this.loading = false;



       if (!session) {
         console.log(`App: No session found ${new Date()}`);
         this.errorMessage = 'Sorry, User does not exist!';
         return; // not logged in
       }
       console.log('Good! now we should redirect user to the email verification page');
       return this.router.navigateByUrl('/confirm');
     })
     .catch(e => {

         this.loading = false;
         this.errorMessage = e.message || 'Sorry, I cannot log you in!';

       console.error(`App: No session found ${e.message}`);
       console.log(e);
       // same as not logged in
     });
  }





}
