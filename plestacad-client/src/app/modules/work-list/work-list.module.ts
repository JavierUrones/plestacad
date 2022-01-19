import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkListComponent } from './work-list.component';
import { WorkListRoutingModule } from './work-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';



@NgModule({
  declarations: [WorkListComponent],
  imports: [
    CommonModule,
    WorkListRoutingModule,
    SharedModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatGridListModule
  ]
})
export class WorkListModule { }
