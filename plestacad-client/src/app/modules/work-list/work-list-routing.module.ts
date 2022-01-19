import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkListComponent } from './work-list.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';



const routes: Routes = [
  {
    path: '',
    component: WorkListComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkListRoutingModule { }
