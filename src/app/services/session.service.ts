/**
* @Author: mars
* @Date:   2017-02-05T00:41:35-05:00
* @Last modified by:   mars
* @Last modified time: 2017-02-12T23:05:35-05:00
*/

import { Injectable } from '@angular/core';

// @TODO put this inside CognitoService
declare var AWSCognito: any;

interface User {
	username: string;
}

@Injectable()
export class SessionService {
	public loggedIn: boolean;
	public confirmed: boolean;
	public registered: boolean;
	public user: any;
	public cognitoSession: any; // this will have the 'isValid' method
	// public user: AWSCognito.CognitoIdentityServiceProvider.CognitoUser;

	constructor() {}

	getIdToken() {
		if (!this.cognitoSession) {
			return undefined;
		}
		return this.cognitoSession.getIdToken().getJwtToken();
	}
}
