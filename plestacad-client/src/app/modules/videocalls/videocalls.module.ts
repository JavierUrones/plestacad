import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { VideocallsRoutingModule } from './videocalls-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { Peer } from "peerjs";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    VideocallsRoutingModule,
    SharedModule,
    MatButtonModule
  ]
})
export class VideocallsModule { }
