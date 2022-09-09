import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { WorkRequestsModule } from './work-requests.module';
import { WorkRequestsComponent } from './work-requests.component';



const routes: Routes = [
  {
    path: '',
    component: WorkRequestsComponent,
    canActivate: [AuthGuard]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkRequestsRoutingModule { }
