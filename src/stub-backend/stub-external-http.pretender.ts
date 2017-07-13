/**
 * NOTE: tested on chrome
 * source: https://www.npmjs.com/package/pretender
 */
import { loginRequest as credRequest } from './http-request-fixtures/cognito-login/index';
import { loginRequest as authRequest } from './http-request-fixtures/cognito-authenticate/index';
import { loginRequest as credIdRequest } from './http-request-fixtures/cognito-cred-identity/index';
import { loginRequest as idRequest } from './http-request-fixtures/cognito-identity/index';
import { loginRequest as refreshRequest } from './http-request-fixtures/cognito-refresh/index';
import { registerRequest } from './http-request-fixtures/cognito-register/index';
import * as Pretender from 'pretender';

export function startExternalStubPretender() {
	const server = new Pretender();
	server.get('*assets', server.passthrough);

	// 1. register
	// 2. confirm password

	// 3. login
	// https://cognito-idp.us-east-1.amazonaws.com/
	// target 1 = AWSCognitoIdentityProviderService.GetAuthenticationDetails
	// target 2 = AWSCognitoIdentityProviderService.Authenticate
	// target 3 = AWSCognitoIdentityService.GetCredentialsForIdentity
	const httpRequest = {
		'AWSCognitoIdentityProviderService.GetAuthenticationDetails': credRequest,
		'AWSCognitoIdentityProviderService.Authenticate': authRequest,
		'AWSCognitoIdentityService.GetCredentialsForIdentity': credIdRequest,
		'AWSCognitoIdentityService.GetId': idRequest,
		'AWSCognitoIdentityProviderService.RefreshTokens': refreshRequest,
		'AWSCognitoIdentityProviderService.SignUp': registerRequest,
	};
	function cognitoLogin(request) {
		const target = request.requestHeaders['X-Amz-Target'];
		console.log(`[PRETENDER - aws cognito] ${request.method} ${request.url} - ${target}`);

		const loginRequest: any = httpRequest[target];
		return new Promise(function(resolve) {
			const response = [
				loginRequest.respone.statusCode,
				loginRequest.respone.headers,
				loginRequest.respone.payload,
			];
			console.log(`[PRETENDER - response]`, response);
			return resolve(response);
		});
	}
	server.post('https://cognito-idp.us-east-1.amazonaws.com/', cognitoLogin);
	server.post('https://cognito-identity.us-east-1.amazonaws.com/', cognitoLogin);

	// 3. logout
	// 4. reset password

	server.passthroughRequest = function(verb, path, request) {
		console.log(`[PRETENDER - PASSTHROUGH] ${verb} ${path}`);
	};
	server.unhandledRequest = function(verb, path, request) {
		console.warn(`[PRETENDER - UNHANDLERED] ${verb} ${path}`);
	};

	console.log('[PRETENDER MOCK] starting external stub plain...');
	return true;
}
