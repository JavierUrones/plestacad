import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { VideocallsRoutingModule } from './videocalls-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { Peer } from "peerjs";
import { BrowserModule } from '@angular/platform-browser';
import { VideocallsComponent } from './videocalls.component';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { EntryCallDialogComponent } from './entry-call-dialog/entry-call-dialog.component';

@NgModule({
  declarations: [ VideocallsComponent, EntryCallDialogComponent],
  imports: [
    CommonModule,

    VideocallsRoutingModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule
  ]
})
export class VideocallsModule { }
