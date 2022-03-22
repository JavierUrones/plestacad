import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkListComponent } from './work-list.component';
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
import { ForoComponent } from './foro/foro/foro.component';


@NgModule({
  declarations: [WorkListComponent, ManageWorkComponent, FilesComponent, DialogOverviewExampleDialog, DialogAddFile, ForoComponent],
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
    ReactiveFormsModule
    
    ],
})
export class WorkListModule {}
