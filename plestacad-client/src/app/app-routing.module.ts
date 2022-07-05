import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './layout/main/main.component';
import { LoginComponent } from './modules/session/login/login.component';
import { SignupComponent } from './modules/session/signup/signup.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'trabajos',
        loadChildren: () => import('./modules/works/work-list.module').then(m => m.WorkListModule),
        data: {
          breadcrumb: 'Mis Trabajos'
        }
      },

      {
        path: 'perfil',
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'calendario',
        loadChildren: () => import('./modules/calendar/calendar.module').then(m => m.CalendarModule)
      },
    ], canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
