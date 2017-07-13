import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { ApiRequestManagerService } from '../../services/api-request-manager.service';

@Component({
  selector: 'app-api-request-log',
  templateUrl: './api-request-log.component.html',
  styleUrls: ['./api-request-log.component.css']
})
export class ApiRequestLogComponent implements OnInit {
  public fetching: Promise<any>;

  public appId: string;

  public appList: Array<any> = []; // makes easy for user to view logs of different apps

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiRequestManagerService: ApiRequestManagerService
  ) {
  }

  ngOnInit() {
    this.apiRequestManagerService.fetchApplicationData( /*@TODO add pagination*/ )
    .then(list => { this.appList = list; });

    // passed in as dynamic param
    this.appId = this.route.snapshot.params['appId'];

    this.fetching = this.apiRequestManagerService.fetchApplicationById(this.appId)
      .then(app => this.apiRequestManagerService.fetchApiRequestData(app));

    this.fetching.then(list => {

      console.log('application-list success', list);
    })
      .catch(e => {
        console.log('application-list failure', e);
      });
  }

  // @TODO
  openApiRequestView(id) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: { 'url': rssUrl }
    // };
    // return `/home?url=${rssUrl}`;
    // this.router.navigate([`/#/request-log/${id}`], navigationExtras);
    this.router.navigate([`/#/request-log/${id}`]);
    return false;
  }

}
