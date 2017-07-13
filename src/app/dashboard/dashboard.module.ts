import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
// import { ApplicationListComponent } from './application-list/application-list.component';
// import { ApiRequestLogComponent } from './api-request-log/api-request-log.component';
// import { HomeComponent } from './home/home.component';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';


import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './dashboard.routes';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(MODULE_ROUTES),

    SidebarModule,
    NavbarModule,
    FooterModule
  ],
  declarations: [DashboardComponent, MODULE_COMPONENTS],
  exports: [DashboardComponent]

})
export class DashboardModule { }
