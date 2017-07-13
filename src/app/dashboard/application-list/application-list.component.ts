import { Component, ElementRef, OnInit, Renderer, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ApiRequestManagerService } from '../../services/api-request-manager.service';

@Component({
	selector: 'app-application-list',
	templateUrl: './application-list.component.html',
	styleUrls: ['./application-list.component.css'],
})
export class ApplicationListComponent implements OnInit {
	@ViewChild('appList') listElRef: ElementRef;
	@ViewChild('appNewOrDetail') elRef: ElementRef;

	fetching: Promise<any>;

	// form describing the application ui
	form: FormGroup;
	applicationName = new FormControl('', Validators.compose([Validators.required, Validators.minLength(2)]));
	description = new FormControl('', Validators.required);

	// loading related values
	public loading: boolean;
	public loadingMessage = 'Working...';
	public errorMessage: string;

	constructor(
		private renderer: Renderer,
		public fb: FormBuilder,
		private apiRequestManagerService: ApiRequestManagerService
	) {
		this.form = fb.group({
			applicationName: this.applicationName,
			description: this.description,
			appCode: '',
		});
	}

	ngOnInit() {
		this.loading = true;

		this.fetching = this.apiRequestManagerService.fetchApplicationData();
		this.fetching
			.then(list => {
				this.loading = false;

				console.log('application-list success', list);
				return list;
			})
			.catch(e => {
				this.loading = false;
				console.log('application-list failure', e);
				return [];
			});
	}

	showApplicationDetail(ev, app) {
		this.form.controls['applicationName'].setValue(app.name);
		this.form.controls['description'].setValue(app.description);
		this.form.controls['appCode'].setValue(app.appCode);

		this.renderer.invokeElementMethod(this.elRef.nativeElement, 'dispatchEvent', [
			new MouseEvent('click', { bubbles: true, cancelable: true }),
		]);
	}
	closeAppDetailView(ev) {
		this.renderer.invokeElementMethod(this.listElRef.nativeElement, 'dispatchEvent', [
			new MouseEvent('click', { bubbles: true, cancelable: true }),
		]);
	}
	resetForm(ev) {
		this.form.reset();
	}
	removeApplication(ev, app) {
		// warn the user about action
		// delete all logs for this app
		// delete app
		debugger;
	}

	submitApplication(ev, appData: { applicationName: string; description: string }) {
		console.log(this.form.value, appData, ev);
		if (!this.form.valid) {
			return;
		}
		const { applicationName: name, description } = appData;

		this.errorMessage = undefined;
		this.loading = true;

		const app = this.apiRequestManagerService.createApplicationObject({ name, description });
		this.apiRequestManagerService
			.saveApplicationData(app)
			.then(record => {
				this.loading = false;
				console.log('saveApplicationData success', record.appCode);
				this.form.reset();
				this.closeAppDetailView(ev);
			})
			.catch(e => {
				this.errorMessage = e.essage;
				this.loading = false;
				console.log('saveApplicationData failure', e);
				// @TODO print the error
				// this.form.reset();
			});
	}
}
