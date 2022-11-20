import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkListComponent } from './work-list.component';
import { WorkListRoutingModule } from './work-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { ManageWorkComponent } from './manage-work/manage-work/manage-work.component';
import { TasksModule } from './tasks/tasks.module';
import { InfoComponent } from './info/info.component';
import {  MatAutocompleteModule} from '@angular/material/autocomplete'
import es from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ModalAddUsers } from './info/modal-add-users/modal-add-users.component';
import { CalendarModule } from './calendar/calendar.module';
import { FilesModule } from './files/files.module';
import { ForoModule } from './foro/foro.module';
import { DialogAddWork } from './manage-work/manage-work/add-work-dialog/add-work.dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
registerLocaleData(es);
@NgModule({
  declarations: [WorkListComponent, ManageWorkComponent,  InfoComponent, DialogAddWork, ModalAddUsers],
  imports: [
    CommonModule,
    WorkListRoutingModule,
    SharedModule,
    ForoModule,
    TasksModule,
    FilesModule,
    CalendarModule,
    RouterModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
    
    ],
    providers: [ { provide: LOCALE_ID, useValue: 'es-ES' }]
})
export class WorkListModule {}
