import { Component, OnInit } from '@angular/core';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';

declare var $: any;

@Component({
	selector: 'app-module-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit  {

	location: Location;
	constructor(location: Location) {
		this.location = location;
	}
	ngOnInit() {
		$.getScript('/assets/js/material-dashboard.js');
		$.getScript('/assets/js/initMenu.js');
	}
	public isMaps(path) {
		let titlee = this.location.prepareExternalUrl(this.location.path());
		titlee = titlee.slice(1);
		if (path === titlee) {
			return false;
		} else {
			return true;
		}
	}
}
