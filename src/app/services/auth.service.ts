/**
* @Author: mars
* @Date:   2017-02-05T00:02:10-05:00
* @Last modified by:   mars
* @Last modified time: 2017-02-10T02:16:39-05:00
*/

import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AwsService } from './aws.service';
import { CognitoService } from './cognito.service';
import { SessionService } from './session.service';

// @TODO put this inside CognitoService
declare var AWSCognito: any;
declare var AWS: any;

@Injectable()
export class AuthService implements CanActivate {
	constructor(
		@Inject(AwsService) public awsService: AwsService,
		@Inject(CognitoService) public cognitoService: CognitoService,
		@Inject(SessionService) public session: SessionService
	) {
		this.initialize();
	}

	initialize() {}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return Promise.resolve(false);
	}

	/**
   * @param user { User }
   */
	registerUser(user): Promise<SessionService> {
		return new Promise((resolve, reject) => {
			const attributes = [];

			const emailData = {
				Name: 'email',
				Value: user.email,
			};

			const nameData = {
				Name: 'name',
				Value: user.name,
			};

			attributes.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(emailData));
			attributes.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(nameData));

			return this.cognitoService
				.getUserPool()
				.signUp(user.username, user.password, attributes, null, (err, result) => {
					if (err) {
						console.log(err);
						return reject(err);
					}
					//  this.session.user = cognitoUser;
					this.session.registered = true;
					console.log(result);
					//  this.setCredentials(result.getIdToken().getJwtToken());
					//  this.session.cognitoSession = result;
					return resolve(this.session);
				});
		});
	}

	/**
   * @param username {string}
   * @param code {string}
   */
	confirmUser(username, code) {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: username,
				Pool: this.cognitoService.getUserPool(),
			};

			const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

			return cognitoUser.confirmRegistration(code, true, (err, result) => {
				if (err) {
					console.log(err);
					return reject(err);
				}
				this.session.confirmed = true;
				return resolve(result); // @TODO what is result?
			});
		});
	}
	/**
   *
   * @param username {string}
   */
	resendCode(username) {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: username,
				Pool: this.cognitoService.getUserPool(),
			};

			const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

			cognitoUser.resendConfirmationCode(function(err, result) {
				if (err) {
					console.log(err);
					return reject(err);
				}
				return resolve(result); // @TODO what is result?
			});
		});
	}

	/**
   * @param username { string }
   * @param password { string }
   */
	loginUser(username, password): Promise<SessionService> {
		return new Promise((resolve, reject) => {
			console.log('UserLoginService: stgarting the authentication');

			const authData = {
				Username: username,
				Password: password,
			};

			const authDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authData);

			const userData = {
				Username: username,
				Pool: this.cognitoService.getUserPool(),
			};

			const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
			console.log('UserLoginService: config is ', AWS.config, AWSCognito.config, cognitoUser);
			return cognitoUser.authenticateUser(authDetails, {
				onSuccess: session => {
					this.session.user = cognitoUser;
					this.setCredentials(session.getIdToken().getJwtToken());
					this.session.cognitoSession = session;
					return resolve(this.session);
				},
				onFailure: err => {
					console.log(err);
					return reject(err);
				},
			});
		});
	}

	logoutUser(): Promise<any> {
		return new Promise((resolve, reject) => {
			const cognitoUser = this.cognitoService.getUserPool().getCurrentUser();
			this.session.user = null;
			this.session.cognitoSession = null;
			if (!cognitoUser) {
				return reject({ message: 'User not found' });
			}
			cognitoUser.signOut();
			return resolve({ message: 'Logout success' });
		});
	}

	/**
   * we can always get the session even if user refreshes the page
   */
	getSession(): Promise<any> {
		return new Promise((resolve, reject) => {
			const cognitoUser = this.cognitoService.getCurrentUser();

			if (!cognitoUser) {
				return this.logoutUser().then(() => resolve(null)).catch(() => resolve(null));
			}
			return cognitoUser.getSession((err, session) => {
				if (err) {
					return reject(err); // this.logoutUser().then(() => resolve(null)).catch(() => resolve(null));
				}
				this.session.user = cognitoUser;
				this.setCredentials(session.getIdToken().getJwtToken());
				this.session.cognitoSession = session;
				return resolve(this.session);
			});
		});
	}

	forgotPassword(username: string) {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: username,
				Pool: this.cognitoService.getUserPool(),
			};

			const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

			cognitoUser.forgotPassword({
				onSuccess: function(result) {
					// @TODO this???
					resolve(null);
				},
				onFailure: function(err) {
					reject(err);
				},
				inputVerificationCode() {
					// @TODO this???
					resolve(null);
				},
			});
		});
	}

	confirmNewPassword(email: string, verificationCode: string, password: string) {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: email,
				Pool: this.cognitoService.getUserPool(),
			};

			const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

			cognitoUser.confirmPassword(verificationCode, password, {
				onSuccess: function(result) {
					resolve(result);
				},
				onFailure: function(err) {
					reject(err);
				},
			});
		});
	}

	/* Helper Functions */

	setCredentials(token) {
		return this.awsService.addCognitoCredentials(token);
	}
	getUserAttributes() {
		return new Promise((resolve, reject) => {
			return this.session.user.getUserAttributes((err, result) => {
				if (err) {
					return reject(err);
				}
				return resolve(result);
			});
		});
	}
}
