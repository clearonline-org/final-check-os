import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-module-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['../../../../assets/css/material-dashboard.css', './footer.component.css']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor() {

  }

  ngOnInit() {
  }

}
