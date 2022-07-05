import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkListComponent } from './work-list.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { ManageWorkComponent } from './manage-work/manage-work/manage-work.component';
import { MainComponent } from 'src/app/layout/main/main.component';
import { QuillModule } from 'ngx-quill'
import { PostManagementComponent } from './foro/foro/post-management/post-management.component';


const routes: Routes = [
  {
    path: '', 
    children: [
      { path: '', component: WorkListComponent, data: {
        breadcrumb: 'WorkList'
    } },
      { path: ':idWork', component: ManageWorkComponent, data: {
        breadcrumb: 'Trabajos'
    }, 
    children: [
      {
        path: 'posts',
        loadChildren: () => import('./foro/foro/foro.module').then(m => m.ForoModule),
  
      },
    ]
  }],
    canActivate: [AuthGuard]
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), QuillModule.forRoot()],
  exports: [RouterModule],
})
export class WorkListRoutingModule {}
