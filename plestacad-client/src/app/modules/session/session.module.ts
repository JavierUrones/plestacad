import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input'
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthenticationService } from './services/authentication.service';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    RouterModule,
    MatButtonModule
    
  ]
})
export class SessionModule { }
