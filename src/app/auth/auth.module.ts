import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth.component';

import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './auth.routes';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { HomeComponent } from './home/home.component';

import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { CognitoService } from '../services/cognito.service';
import { AwsService } from '../services/aws.service';

import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(MODULE_ROUTES)
  ],
  providers: [AuthService, SessionService, CognitoService, AwsService],
  declarations: [AuthComponent, MODULE_COMPONENTS, LoginComponent,
    RegisterComponent, ConfirmComponent, HomeComponent, ResetPasswordComponent
 ],
  exports: [AuthComponent]

})
export class AuthModule { }
