/**
* @Author: mars
* @Date:   2017-02-05T22:14:14-05:00
* @Last modified by:   mars
* @Last modified time: 2017-02-05T23:36:48-05:00
*/

import { Injectable } from '@angular/core';

import { CognitoService, Callback } from './cognito.service';

declare var AWS: any;
declare var AMA: any;

@Injectable()
export class AwsService {
	public static firstLogin = false;
	public static runningInit = false;

	static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
		console.log('AwsService: enter getCognitoParametersForIdConsolidation()');
		const url =
			'cognito-idp.' + CognitoService._REGION.toLowerCase() + '.amazonaws.com/' + CognitoService._USER_POOL_ID;
		const logins: Array<string> = [];
		logins[url] = idTokenJwt;
		const params = {
			IdentityPoolId: CognitoService._IDENTITY_POOL_ID /* required */,
			Logins: logins,
		};

		return params;
	}

	constructor() {
		AWS.config.region = CognitoService._REGION;
	}

	/**
     * This is the method that needs to be called in order to init the aws global creds
     */
	initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {
		if (AwsService.runningInit) {
			// Need to make sure I don't get into an infinite loop here, so need to exit if this method is running already
			console.log("AwsService: Aborting running initAwsService()...it's running already.");
			// instead of aborting here, it's best to put a timer
			if (callback != null) {
				callback.callback();
				callback.callbackWithParam(null);
			}
			return;
		}

		console.log('AwsService: Running initAwsService()');
		AwsService.runningInit = true;

		const mythis = this;
		// First check if the user is authenticated already
		if (isLoggedIn) {
			mythis.setupAWS(isLoggedIn, callback, idToken);
		}
	}

	/**
     * Sets up the AWS global params
     *
     * @param isLoggedIn
     * @param callback
     */
	setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {
		console.log('AwsService: in setupAWS()');
		if (isLoggedIn) {
			console.log('AwsService: User is logged in');
			// Setup mobile analytics
			const options = {
				appId: '<TODO>',
				appTitle: '<TODO>',
			};

			const mobileAnalyticsClient = new AMA.Manager(options);
			mobileAnalyticsClient.submitEvents();

			this.addCognitoCredentials(idToken);

			console.log('AwsService: Retrieving the id token');
		} else {
			console.log('AwsService: User is not logged in');
		}

		if (callback != null) {
			callback.callback();
			callback.callbackWithParam(null);
		}

		AwsService.runningInit = false;
	}

	addCognitoCredentials(idTokenJwt: string): void {
		const params = AwsService.getCognitoParametersForIdConsolidation(idTokenJwt);

		AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);

		AWS.config.credentials.get(function(err) {
			if (!err) {
				// var id = AWS.config.credentials.identityId;
				if (AwsService.firstLogin) {
					// save the login info to DDB
					this.ddb.writeLogEntry('login');
					AwsService.firstLogin = false;
				}
			}
		});
	}
}
