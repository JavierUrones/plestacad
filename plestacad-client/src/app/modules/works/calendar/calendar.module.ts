import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CalendarWorkComponent } from './calendar.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogNewEvent } from './modal-events/modal-events';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DialogNewEvent, CalendarWorkComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DragDropModule,
    FullCalendarModule,
    MatListModule,
    MatChipsModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatOptionModule,
    ReactiveFormsModule
    ],
    exports: [CalendarWorkComponent]
})
export class CalendarModule {}
