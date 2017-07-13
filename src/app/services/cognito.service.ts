/**
* @Author: mars
* @Date:   2017-02-05T00:16:24-05:00
* @Last modified by:   mars
* @Last modified time: 2017-02-05T23:37:11-05:00
*/

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * @source https://github.com/awslabs/aws-cognito-angular2-quickstart/blob/master/src/app/service/cognito.service.ts
 */

declare var AWSCognito: any;
declare var AWS: any;

export interface CognitoCallback {
	cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
	isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
	callback(): void;
	callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoService {
	public static _REGION = environment.region;

	public static _IDENTITY_POOL_ID = environment.identityPoolId;
	public static _USER_POOL_ID = environment.userPoolId;
	public static _CLIENT_ID = environment.appClientId;

	public static _POOL_DATA = {
		UserPoolId: CognitoService._USER_POOL_ID,
		ClientId: CognitoService._CLIENT_ID,
	};

	public static getAwsCognito(): any {
		return AWSCognito;
	}

	constructor() {
		// Need to provide placeholder keys unless unauthorised user access is enabled for user pool
		AWSCognito.config.update({ accessKeyId: 'anything', secretAccessKey: 'anything' });
		AWSCognito.config.region = CognitoService._REGION;
	}

	/**
   * @return
   */
	getUserPool() {
		return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(CognitoService._POOL_DATA);
	}

	getCurrentUser() {
		return this.getUserPool().getCurrentUser();
	}

	getCognitoIdentity(): string {
		return AWS.config.credentials.identityId;
	}

	getAccessToken(callback: Callback): void {
		if (callback == null) {
			throw new Error('CognitoUtil: callback in getAccessToken is null...returning');
		}
		if (this.getCurrentUser() != null)
			this.getCurrentUser().getSession(function(err, session) {
				if (err) {
					console.log("CognitoUtil: Can't set the credentials:" + err);
					callback.callbackWithParam(null);
				} else {
					if (session.isValid()) {
						callback.callbackWithParam(session.getAccessToken().getJwtToken());
					}
				}
			});
		else {
			callback.callbackWithParam(null);
		}
	}

	getIdToken(callback: Callback): void {
		if (callback == null) {
			throw new Error('CognitoUtil: callback in getIdToken is null...returning');
		}
		if (this.getCurrentUser() != null)
			this.getCurrentUser().getSession(function(err, session) {
				if (err) {
					console.log("CognitoUtil: Can't set the credentials:" + err);
					callback.callbackWithParam(null);
				} else {
					if (session.isValid()) {
						callback.callbackWithParam(session.getIdToken().getJwtToken());
					} else {
						console.log("CognitoUtil: Got the id token, but the session isn't valid");
					}
				}
			});
		else {
			callback.callbackWithParam(null);
		}
	}

	getRefreshToken(callback: Callback): void {
		if (callback == null) {
			throw new Error('CognitoUtil: callback in getRefreshToken is null...returning');
		}
		if (this.getCurrentUser() != null) {
			this.getCurrentUser().getSession(function(err, session) {
				if (err) {
					console.log("CognitoUtil: Can't set the credentials:" + err);
					callback.callbackWithParam(null);
				} else {
					if (session.isValid()) {
						callback.callbackWithParam(session.getRefreshToken());
					}
				}
			});
		} else {
			callback.callbackWithParam(null);
		}
	}

	refresh(): void {
		this.getCurrentUser().getSession(function(err, session) {
			if (err) {
				console.log("CognitoUtil: Can't set the credentials:" + err);
			} else {
				if (session.isValid()) {
					console.log('CognitoUtil: refreshed successfully');
				} else {
					console.log('CognitoUtil: refreshed but session is still not valid');
				}
			}
		});
	}
}
