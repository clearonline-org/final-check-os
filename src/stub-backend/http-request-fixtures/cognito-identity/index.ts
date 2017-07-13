/// <reference path="../custom-typings/json-file.d.ts" />

import * as requestHeaders from './request-headers.json';
import * as responseHeaders from './response-headers.json';

import { requestPayload } from './request-payload';
import { responsePayload } from './response-payload';

/**
 * Follows Final Check log format
 * source: https://github.com/clearonline-org/final-check#protocol
 */
export const loginRequest = {
	url: 'https://cognito-identity.us-east-1.amazonaws.com/',
	request: {
		payload: requestPayload,
		method: 'POST',
		headers: requestHeaders,
		host: '52.6.92.48:443',
		clientIp: '127.0.0.1',
	},
	respone: {
		payload: responsePayload, // governed by the response content-type header
		headers: responseHeaders,
		statusCode: 200,
		status: '200 OK',
	},
	latency: 100, // picked randomly
};
