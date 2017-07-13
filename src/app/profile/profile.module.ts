import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile.component';
import { HomeComponent } from './home/home.component';

import { RouterModule } from '@angular/router';
import { MODULE_COMPONENTS, MODULE_ROUTES } from './profile.routes';

@NgModule({
	imports: [CommonModule, RouterModule.forChild(MODULE_ROUTES)],
	declarations: [MODULE_COMPONENTS, LogoutComponent, ProfileComponent, HomeComponent],
	exports: [ProfileComponent],
})
export class ProfileModule {}
