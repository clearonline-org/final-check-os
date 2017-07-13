/**
 * This service is in charge of creating apps and request objects, from remote data
 */
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, BaseRequestOptions, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';

import { SessionService } from './session.service';

import { ApiRequest } from '../models/api-request';
import { Application } from '../models/application';
import 'rxjs/add/operator/toPromise';

export interface IAPPSummary {
	id: string;
	name: string;
	logs: number;
}

export interface ILOGSummary {
	OK200: { totalLogs: number; breakdown: Array<IAPPSummary> };
	ERROR500: { totalLogs: number; breakdown: Array<IAPPSummary> };
	OTHER3400: { totalLogs: number; breakdown: Array<IAPPSummary> };
}

@Injectable()
export class ApiRequestManagerService {
	registrationaApi = environment.REGISTRATION_API;
	registrationaListingApi = environment.REGISTRATION_LISTING_API;
	logListingApi = environment.LOG_LISTING_API;
	logSummaryApi = environment.LOG_SUMMARY_API;

	private _applicationList: Array<Application> = [];
	private _apiRequestList = [];
	constructor(@Inject(SessionService) public session: SessionService, private http: Http) {}

	cleanup(): Promise<boolean> {
		this._applicationList = [];
		this._apiRequestList = [];
		return Promise.resolve(true);
	}
	// fetching from the backend
	fetchApplicationIdList(): Promise<Array<string>> {
		return this.fetchApplicationData().then(list => list.map(app => app.id));
	}
	fetchApplicationData(): Promise<Array<Application>> {
		// from { appcode, description, id, name, userId }
		// to { name, description, appCode }
		if (this._applicationList.length > 0) {
			return Promise.resolve(this._applicationList);
		}
		// here we make http request

		// @TODO remove 05-19-2017
		// return new Promise(resolve => {
		//   setTimeout(() => {
		//     return resolve(
		//       [{
		//         name: 'Test App 1', description: 'App desc 1', appCode: '123-asd-456'
		//       }, {
		//         name: 'Test App 2', description: 'App desc 2', appCode: '123-asd-qweqwe-12345'
		//       }, {
		//         name: 'Test App 3', description: 'App desc 3', appCode: '123-ert-qwerty-64321'
		//       }]
		//     );
		//   }, 300);
		// })
		return this.listRegisteredApplications()
			.then((data: Array<any>) => {
				const appList = data.map(app => {
					const { id, appcode: appCode, description, name } = app;
					return { id, name, description, appCode };
				});
				return Promise.resolve(appList);
			})
			.then((data: Array<any>) => {
				return data.map(record => this.createApplicationObject(record));
			})
			.then((data: Array<Application>) => {
				this._applicationList = data; // caching
				return data;
			});
	}

	fetchApiRequestData(app: Application) {
		return (
			this.listloggedHttpRequests(app.appCode)
				.then(list => {
					return list.map(log => this.parseLog(log));
				})
				// here we make http request
				// @TODO remove 05-19-2017

				.then((data: Array<any>) => {
					return data.map(record => {
						const apiRequest = this.createHttpRequestObject(record);
						app.apiRequestList.push(apiRequest);
						return apiRequest;
					});
				})
		);
	}

	/**
   * @TODO what is JSON?
   * @param appData {JSON}
   */
	createApplicationObject(appData: any): Application {
		const { id, name, description, appCode } = appData;
		const app = new Application(name, description, id);
		app.appCode = appCode;
		return app;
	}
	/**
   *
   * @param arData {JSON} ar refers to Api Request
   */
	createHttpRequestObject(arData: {
		id: string;
		uri: string;
		request: any;
		response: any;
		latency: number;
		meta: any;
	}) {
		const { id, uri, request: input, response: output, latency, meta } = arData;
		return this.createApiRequestObject({ id, uri, input, output, latency, meta });
	}
	createApiRequestObject(arData: any) {
		const { id, uri, input, output, latency, meta } = arData;
		const apiRequest = new ApiRequest(uri, input, id);
		apiRequest.output = output;
		apiRequest.latency = latency;
		apiRequest.metaData = meta;
		return apiRequest;
	}

	fetchApplicationById(appId) {
		return this.fetchApplicationData().then(list => list.find(app => app.id === appId));
	}
	fetchApiRequestByAppIdAndRId(appId: string, rId: string) {
		return this.fetchApplicationById(appId)
			.then(app =>
				// @TODO optimization is needed
				this.fetchApiRequestData(app).then(logs => logs.find(request => request.id === rId))
			)
			.catch(e => Promise.reject('Application does not exist!'));
	}
	/**
   * saving the app to remote db,
   * this action will generate an application code 'appCode'
   * @param app {Application}
   * @returns
   */
	saveApplicationData(app: Application): Promise<Application> {
		const { name, description } = app;
		return this.registerApplication(name, description).then(({ appcode }) => {
			app.appCode = appcode;
			this._applicationList.push(app);
			return app;
		});
	}

	/**
   * @param name string
   * @param description string
   * @return Promise<{ appcode  }>
   */
	registerApplication(name: string, description: string): Promise<{ appcode: string }> {
		return new Promise(resolve => {
			const url = this.registrationaApi;
			const headers = new Headers({
				'Content-Type': 'application/json',
				Authorization: this.session.getIdToken(),
			});
			const options = new RequestOptions({ headers });

			const application = { name, description };
			return resolve({ url, application, options });
		})
			.then(({ url, application, options }) => this.http.post(url, { application }, options).toPromise())
			.then((res: Response) => {
				console.log('HttpLoggingService', res.json());
				return res.json();
			})
			.catch(e => {
				console.log('HttpLoggingService', e);
				return null;
			});
	}

	/**
   * @return Promise<Array<{ name, description, appcode }>>
   */
	listRegisteredApplications() {
		return new Promise(resolve => {
			const headers = new Headers({
				'Content-Type': 'application/json',
				Authorization: this.session.getIdToken(),
			});
			const options = new RequestOptions({ headers });
			const url = this.registrationaListingApi;

			return resolve({ url, options });
		})
			.then(({ url, options }) => this.http.get(url, options).toPromise())
			.then((res: Response) => {
				return res.json();
			})
			.catch(e => {
				return [];
			});
	}

	/**
   * list all request that has been logged for a given application
   */
	listloggedHttpRequests(appCode: string, page = 1, size = 50): Promise<any> {
		return new Promise(resolve => {
			const headers = new Headers({
				'Content-Type': 'application/json',
				Authorization: this.session.getIdToken(),
				appcode: appCode,
			});
			const options = new RequestOptions({ headers });
			const url = this.logListingApi;

			return resolve({ url, options });
		})
			.then(({ url, options }) => {
				return this.http.get(url, options).toPromise();
			})
			.then((res: Response) => {
				const result = res.json();
				return result;
			})
			.catch(e => {
				return [];
			});
	}

	/**
	 * get summary of your configured apps - logs are categorized by status
	 * @param appId
	 */
	logSummary(
		appId?: string
	): Promise<ILOGSummary> {
		return this.logBreakdown(appId).then(breakdown => {
			let totalLogs = breakdown.OK200.reduce((ac, val) => ac + val.logs, 0);
			const OK200 = Object.assign({}, { totalLogs, breakdown: breakdown.OK200 });
			totalLogs = breakdown.ERROR500.reduce((ac, val) => ac + val.logs, 0);
			const ERROR500 = Object.assign({}, { totalLogs, breakdown: breakdown.ERROR500 });
			totalLogs = breakdown.OTHER3400.reduce((ac, val) => ac + val.logs, 0);
			const OTHER3400 = Object.assign({}, { totalLogs, breakdown: breakdown.OTHER3400 });

			return { OK200, ERROR500, OTHER3400 };
		});
	}

	/**
	 *
	 * @param appId
	 * @return Promise<> id: applicationId, name: applicationName
	 */
	logBreakdown(
		appId?: string
	): Promise<{
		OK200: Array<IAPPSummary>;
		ERROR500: Array<IAPPSummary>;
		OTHER3400: Array<IAPPSummary>;
	}> {
		// TODO create backend API that returns this information
			const url = this.logSummaryApi;
		// return this.makeGetRequest(url).catch(() => { OK200: [], ERROR500:[], OTHER3400:[] );
		return Promise.resolve({ OK200: [], ERROR500:[], OTHER3400:[] });
	}

	/**
   * @param input { url, senderIp, request: { method, headers, body }, response: { headers, body}}
   * @return { uri, request: { method, headers, payload }, response: { headers, payload, statusCode }, meta: { clientIp } }
   */
	parseLog(input) {
		const { id, url: uri, senderIp: clientIp, request, response } = input;
		const { method, headers: qh, body: qb } = request;
		const { headers, body: payload } = response;
		return {
			id,
			uri,
			request: { method, headers: qh, payload: qb },
			response: { headers, payload, statusCode: 200 },
			meta: { clientIp, message: 'no analysis performed!' },
		};
	}


	makeGetRequest(url: string): Promise<any> {
		return new Promise(resolve => {
			const headers = new Headers({
				'Content-Type': 'application/json',
				Authorization: this.session.getIdToken(),
			});
			const options = new RequestOptions({ headers });

			return resolve({ url, options });
		})
			.then(({ url, options }) => this.http.get(url, options).toPromise())
			.then((res: Response) => {
				return res.json();
			})
			.catch(e => {
				return [];
			});
	}

}

function fakeDataSummary() {
	return [
		{ name: 'app 123', id: '2342424', logs: 345 },
		{ name: 'app fdgdfgd', id: '2342424', logs: 345 },
		{ name: 'app sdsd', id: '2342424', logs: 345 },
	];
}
