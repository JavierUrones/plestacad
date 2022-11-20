import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { VideocallsRoutingModule } from './videocalls-routing.module';
import { VideocallsComponent } from './videocalls.component';
import { EntryCallDialogComponent } from './entry-call-dialog/entry-call-dialog.component';

@NgModule({
  declarations: [ VideocallsComponent, EntryCallDialogComponent],
  imports: [
    CommonModule,
    VideocallsRoutingModule,
    SharedModule
  ]
})
export class VideocallsModule { }
