import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import {  FilesComponent } from './files.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { TreeTableModule } from 'primeng/treetable';
import { DialogAddDirectory } from './modal-file/modal-add-directory';
import { DialogUploadFile } from './modal-file/modal-upload-file';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [FilesComponent, DialogAddDirectory, DialogUploadFile],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgxMatFileInputModule,
    TreeTableModule,
    MatSnackBarModule,

    ],
    exports: [FilesComponent]
})
export class FilesModule {}
