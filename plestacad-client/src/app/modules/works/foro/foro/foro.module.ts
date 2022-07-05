import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { QuillModule } from 'ngx-quill'
import { ForoRoutingModule } from './foro-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogAddPost, PostListComponent } from './post-list/post-list.component';
import { ForoComponent } from './foro.component';
import { PostManagementComponent } from './post-management/post-management.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ForoComponent, DialogAddPost, PostListComponent, PostManagementComponent],
  imports: [
    CommonModule,
    ForoRoutingModule,
    SharedModule,
    MatCardModule,
    RouterModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    QuillModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatGridListModule,
    MatTabsModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
        MatInputModule
    ],
    exports: [ForoComponent]
})
export class ForoModule {}
