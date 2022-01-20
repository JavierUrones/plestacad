import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  form: FormGroup;
  public loginInvalid = false;
  private formSubmitAttempt = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {


    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {

  }

  async onSubmit(): Promise<void> {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
        const email = this.form.get('email')?.value;
        const password = this.form.get('password')?.value;

        this.authenticationService.login(email, password).subscribe({
          next: (response) => {
            console.log("RESPUESTA", response);
                const token = (<any> response).token;
                localStorage.setItem("jwt", token);
                console.log("User is logged in " + token);
                this.router.navigateByUrl('/');
          },
          error: (e) => this.loginInvalid = true
      })
        
    } else {
      this.formSubmitAttempt = true;
    }
  }

}
