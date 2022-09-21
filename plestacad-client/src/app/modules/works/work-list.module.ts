import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogAddWork, WorkListComponent } from './work-list.component';
import { WorkListRoutingModule } from './work-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import {MatDialogModule} from '@angular/material/dialog';
import { ManageWorkComponent } from './manage-work/manage-work/manage-work.component';
import { DialogAddFile, DialogOverviewExampleDialog, FilesComponent } from './files/files/files.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from '@angular/material/table'
import {TreeTableModule} from 'primeng/treetable';
import {TreeNode} from 'primeng/api';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { QuillModule } from 'ngx-quill'
import { ForoModule } from './foro/foro/foro.module';
import { TasksModule } from './tasks/tasks.module';
import {FullCalendarModule} from 'primeng/fullcalendar'
import { CalendarWorkComponent, DialogNewEvent } from './calendar/calendar.component';
import { InfoComponent } from './info/info.component';
import {  MatAutocompleteModule} from '@angular/material/autocomplete'
import { CalendarService } from './calendar/calendar.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatSnackBarModule} from '@angular/material/snack-bar'
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ModalAddUsers } from './info/modal-add-users/modal-add-users.component';

registerLocaleData(es);
@NgModule({
  declarations: [DialogNewEvent, WorkListComponent, ManageWorkComponent, FilesComponent, DialogOverviewExampleDialog, DialogAddFile, InfoComponent, CalendarWorkComponent, DialogAddWork, ModalAddUsers],
  imports: [
    CommonModule,
    WorkListRoutingModule,
    SharedModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatGridListModule,
    MatTabsModule,
    MatTreeModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    TreeTableModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMatFileInputModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    QuillModule,
    MatProgressSpinnerModule,
    ForoModule,
    MatAutocompleteModule,
    FullCalendarModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatDatepickerModule,
    TasksModule,
    MatSnackBarModule
    ],
    providers: [ { provide: LOCALE_ID, useValue: 'es-ES' }]
})
export class WorkListModule {}
