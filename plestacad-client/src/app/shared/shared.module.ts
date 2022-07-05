import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }  from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { MatMenuModule }  from '@angular/material/menu';
import { MatListModule }  from '@angular/material/list';
import { MatDividerModule }  from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CustomBreadcrumbComponent } from './components/custom-breadcrumb/custom-breadcrumb.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    BreadcrumbComponent,
    CustomBreadcrumbComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule
  ],
  exports: [
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    BreadcrumbComponent,
    CustomBreadcrumbComponent
  ],
  providers:[
  ]
})
export class SharedModule { }
