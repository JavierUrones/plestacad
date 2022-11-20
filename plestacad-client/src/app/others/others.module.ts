import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'primeng/api';
import { ContactoComponent } from './contact/contact.component';
import { HelpComponent } from './help/help.component';
import { LegalInfoComponent } from './legal-info/legal-info.component';
import { OthersRoutingModule } from './others-routing.module';
import { Pagina404Component } from './pagina404/pagina404.component';

/** Define los componentes de la página404, información legal, contacto y ayuda. */
@NgModule({
  declarations: [
    Pagina404Component, LegalInfoComponent, ContactoComponent, HelpComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    FlexLayoutModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    OthersRoutingModule
  ]
  ,
  providers: [
  ]
})
export class OthersModule { }
