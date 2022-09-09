import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { WorkRequestsRoutingModule } from './work-requests-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkListModule } from '../works/work-list.module';
import { MatSortModule } from '@angular/material/sort';
import { TasksModule } from '../works/tasks/tasks.module';
import { WorkRequestsComponent } from './work-requests.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [WorkRequestsComponent],
  imports: [
    CommonModule,
    WorkRequestsRoutingModule,
    SharedModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    WorkListModule,
    MatProgressSpinnerModule
]
})
export class WorkRequestsModule { }
