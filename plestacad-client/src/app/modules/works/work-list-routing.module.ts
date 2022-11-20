import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkListComponent } from './work-list.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { ManageWorkComponent } from './manage-work/manage-work/manage-work.component';
import { QuillModule } from 'ngx-quill'


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
        loadChildren: () => import('./foro/foro.module').then(m => m.ForoModule),
  
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
