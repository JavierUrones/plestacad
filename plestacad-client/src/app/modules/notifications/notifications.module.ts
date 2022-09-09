import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { WorkListModule } from '../works/work-list.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotificationsComponent } from './notifications.component';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [NotificationsComponent ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    WorkListModule,
    MatProgressSpinnerModule,
    MatSelectModule
]
})
export class NotificationsModule { }
