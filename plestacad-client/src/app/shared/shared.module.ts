import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }  from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { MatMenuModule }  from '@angular/material/menu';
import { MatBadgeModule }  from '@angular/material/badge';

import { MatListModule }  from '@angular/material/list';
import { MatDividerModule }  from '@angular/material/divider';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CustomBreadcrumbComponent } from './components/custom-breadcrumb/custom-breadcrumb.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { ConfirmDialog } from './components/confirm-dialog/confirm-dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LegalInfoComponent } from '../others/legal-info/legal-info.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    CustomBreadcrumbComponent,
    ConfirmDialog,
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
    RouterModule,
    MatBadgeModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ScrollingModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatTooltipModule
  ],
  exports: [
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    ConfirmDialog,
    CustomBreadcrumbComponent,
    TranslateModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    MatBadgeModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ScrollingModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule 
  ],
  providers:[
  ]
})
export class SharedModule { }
