import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import {MatPaginatorModule } from '@angular/material/paginator';
import { QuillModule } from 'ngx-quill'
import { ForoRoutingModule } from './foro-routing.module';
import { DialogAddPost, PostListComponent } from './post-list/post-list.component';
import { ForoComponent } from './foro.component';
import { PostManagementComponent } from './post-management/post-management.component';

@NgModule({
  declarations: [ForoComponent, DialogAddPost, PostListComponent, PostManagementComponent],
  imports: [
    CommonModule,
    ForoRoutingModule,
    SharedModule,
    RouterModule,
    MatPaginatorModule,
    QuillModule
    ],
    exports: [ForoComponent]
})
export class ForoModule {}
