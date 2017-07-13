import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HashLocationStrategy, LocationStrategy, Location } from '@angular/common';

import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ProfileModule } from './profile/profile.module';

import { AppComponent } from './app.component';

import { ApiRequestManagerService } from './services/api-request-manager.service';
import { ToTimeUnitPipe } from './pipes/to-time-unit.pipe';

// directives
import { PublicRouteGuard } from './guards/public-route.guard';
import { PrivateRouteGuard } from './guards/private-route.guard';
@NgModule({
  declarations: [
    AppComponent,
    ToTimeUnitPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    RouterModule.forRoot([
      // root url goes to auth, auth redirects to dashboard if session exists
    ]),
    AuthModule,
    DashboardModule,
    ProfileModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    Location,
    ApiRequestManagerService,
    ToTimeUnitPipe,
    PublicRouteGuard,
    PrivateRouteGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
