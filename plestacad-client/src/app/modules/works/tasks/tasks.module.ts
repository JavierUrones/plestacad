import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

import { TasksComponent } from './tasks.component';
import { BoardComponent } from './board/board.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ListTasksComponent } from './list/list-tasks.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {    MatDatepickerModule } from '@angular/material/datepicker'
import { DialogManageTask } from './dialog-manage-task/dialog-manage-task';
import {MatSortModule} from '@angular/material/sort';
import { A11yModule } from '@angular/cdk/a11y'

@NgModule({
  declarations: [TasksComponent, BoardComponent, ListTasksComponent, DialogManageTask],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DragDropModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatTableModule,
    A11yModule
    ],
    exports: [TasksComponent, BoardComponent]
})
export class TasksModule {}
