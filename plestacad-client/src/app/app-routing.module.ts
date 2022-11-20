import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './modules/admin/admin.component';
import { AdminGuard } from './modules/admin/admin.guard';
import { MainComponent } from './layout/main/main.component';
import { LoginComponent } from './modules/session/login/login.component';
import { SignupComponent } from './modules/session/signup/signup.component';
import { Pagina404Component } from './others/pagina404/pagina404.component';

import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', loadChildren: () => import('./others/others.module').then(m => m.OthersModule)
  },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
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
        path: 'solicitudes-trabajos',
        loadChildren: () => import('./modules/work-requests/work-requests.module').then(m => m.WorkRequestsModule)
  
      },
      {
        path: 'notificaciones',
        loadChildren: () => import('./modules/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'videollamadas',
        loadChildren: () => import('./modules/videocalls/videocalls.module').then(m => m.VideocallsModule)

      },

      {
        path: '404',
        component: Pagina404Component
      },
      {
        path: '**',
        redirectTo: '404'
      }
    ], canActivate: [AuthGuard],

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
