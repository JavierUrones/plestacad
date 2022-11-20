import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkRequestsRoutingModule } from './work-requests-routing.module';
import { MatTableModule } from '@angular/material/table';
import { WorkRequestsComponent } from './work-requests.component';



@NgModule({
  declarations: [WorkRequestsComponent],
  imports: [
    CommonModule,
    WorkRequestsRoutingModule,
    SharedModule,
    MatTableModule
    
]
})
export class WorkRequestsModule { }
