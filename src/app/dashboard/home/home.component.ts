import { Component, OnInit } from '@angular/core';
import { ApiRequestManagerService, IAPPSummary, ILOGSummary } from '../../services/api-request-manager.service';

export enum DashboardWidgetTypes {
	OK200,
	ERROR500,
	OTHER3400,
}

interface DashboardWidgets {
	OK200: { show: boolean };
	ERROR500: { show: boolean };
	OTHER3400: { show: boolean };
}

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  dashboardWidgets: DashboardWidgets;
  DashboardWidgetTypes: any;
  logSummary: ILOGSummary;
	constructor(
    		private apiRequestManagerService: ApiRequestManagerService
  ) {
    this.DashboardWidgetTypes = DashboardWidgetTypes;
		this.dashboardWidgets = {
			OK200: { show: false },
			ERROR500: { show: false },
			OTHER3400: { show: false },
		};
	}

	ngOnInit() {
    this.apiRequestManagerService.logSummary()
    .then(summary => {
      this.logSummary = summary;
    });
  }

	tootgleApplicationList(ev, widgetType: DashboardWidgetTypes) {
		switch (widgetType) {
			case DashboardWidgetTypes.OK200:
				this.dashboardWidgets.OK200.show = !this.dashboardWidgets.OK200.show;
				break;
			case DashboardWidgetTypes.ERROR500:
				this.dashboardWidgets.ERROR500.show = !this.dashboardWidgets.ERROR500.show;
				break;
			case DashboardWidgetTypes.OTHER3400:
				this.dashboardWidgets.OTHER3400.show = !this.dashboardWidgets.OTHER3400.show;
				break;
		}
	}
}
