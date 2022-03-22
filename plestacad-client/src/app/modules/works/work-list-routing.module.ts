import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkListComponent } from './work-list.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { ManageWorkComponent } from './manage-work/manage-work/manage-work.component';
import { MainComponent } from 'src/app/layout/main/main.component';

const routes: Routes = [
  {
    path: '', 
    children: [
      { path: '', component: WorkListComponent, data: {
        breadcrumb: 'List'
    } },
      { path: ':id', component: ManageWorkComponent, data: {
        breadcrumb: 'TFG'
    }}],
    canActivate: [AuthGuard]
    
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkListRoutingModule {}
