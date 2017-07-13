import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent]
})
export class SidebarModule { }
