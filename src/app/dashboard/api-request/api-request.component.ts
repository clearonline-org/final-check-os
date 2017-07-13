import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

import { ApiRequestManagerService } from '../../services/api-request-manager.service';

@Component({
  selector: 'app-api-request',
  templateUrl: './api-request.component.html',
  styleUrls: ['./api-request.component.css']
})
export class ApiRequestComponent implements OnInit {
  public fetching: Promise<any>;
  public errorMessage: string;

  uri: string;
  metadata: { title: string, statusMessage: string, description: string, managerMessage: string, developerMessage: string }; // ...
  request: { method: string,  contentType: string, headers: Array<{ header: string, value: string }>, payload: string };
  response: { contentType: string, headers: Array<{ header: string, value: string }>,
    statusCode: number, latency: number, payload: string };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiRequestManagerService: ApiRequestManagerService
  ) {
    this.errorMessage = undefined;
  }

  ngOnInit() {
    const appId = this.route.snapshot.params['appId'];
    const apiRequestId = this.route.snapshot.params['id'];

    this.fetching = this.apiRequestManagerService
      .fetchApiRequestByAppIdAndRId(appId, apiRequestId);

    this.fetching.then(requestObject => {
      console.log('application-list success', requestObject);
      const { uri, input, output, metaData, latency } = requestObject;

      // START computation
      this.uri = uri;
      const { description, managerMessage, developerMessage } = metaData;
      this.metadata = {
        title: this.createTitle(metaData),
        statusMessage: this.createMessage(metaData),
        description, managerMessage, developerMessage };
      this.request = {
        method: input.method,
        contentType: this.prepareCType(input.headers),
        headers: this.prepareHeaders(input.headers),
        payload: this.preparePayload('dtype-JSON', input.payload)};
      this.response = {
        contentType: this.prepareCType(input.headers),
        headers: this.prepareHeaders(output.headers),
        statusCode: output.statusCode, latency,
        payload: this.preparePayload('dtype-JSON', output.payload) };
      // END computation

      this.errorMessage = undefined;
    })
      .catch(e => {
        console.log('application-list failure', e);
        this.errorMessage = e.message || e;
      });

  }


  // START helper methods
  // @TODO clarify the output
  createTitle(metaData: any): any {
    return `Called from ${metaData.clientIp}`;
  }
  createMessage(metaData: any): any {
    return `Sent by the backend analyser - ${metaData.message}`;
  }

  prepareCType(headers) {
    return headers['content-type'] || 'application/text';
  }
  /**
   *
   * @param dataType used to decide on how to prepare the input data ex: JSON, XML, binary
   * @param input
   */
  preparePayload(dataType, input) {
    return JSON.stringify(input);
  }
  prepareHeaders(headers): Array<{ header: string, value: string }> {
    return Object.keys(headers).map(header => ({ header, value: headers[header] }));
  }
  // END helper methods

}
