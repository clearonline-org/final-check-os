import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ROUTES } from './sidebar-routes.config';

declare var $: any;

@Component({
	moduleId: module.id,
	selector: 'app-module-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['../../../assets/css/material-dashboard.css', './sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
	public menuItems: any[];

	constructor(public router: Router) {}

	ngOnInit() {
		// $.getScript('../../assets/js/sidebar-moving-tab.js');
		this.menuItems = ROUTES.filter(menuItem => menuItem);
	}

	goToRoute(ev, route: string): void {
		// close the menu
		if ($('html').hasClass('nav-open')) {
			// console.log('IN Dashboard component closing...', $('.navbar-toggle'));

			$('.main-panel').off('animationend').on('animationend', (evt) => {
				evt.preventDefault();
				$('.main-panel').off('animationend');
				// console.log('animation end', evt);

				// transition
				this.router.navigateByUrl(route);
				return false;
			});

			$('.navbar-toggle').trigger('click');
		} else {
				console.log('NOT NOT NOT animation end', ev);
			// transition
			this.router.navigateByUrl(route);
		}
	}
}
