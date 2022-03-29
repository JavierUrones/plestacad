import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { MainComponent } from 'src/app/layout/main/main.component';
import { QuillModule } from 'ngx-quill'
import { ForoComponent } from './foro.component';
import { PostManagementComponent } from './post-management/post-management.component';
import { PostListComponent } from './post-list/post-list.component';
const routes: Routes = [
    {
        path: '', component: PostListComponent,
        canActivate: [AuthGuard] 
      },
  {
    path: ':id', component: PostManagementComponent, data: {
        breadcrumb: 'Element'
    },
    canActivate: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), QuillModule.forRoot()],
  exports: [RouterModule],
})
export class ForoRoutingModule {}
