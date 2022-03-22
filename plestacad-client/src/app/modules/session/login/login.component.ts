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
                const token = (<any> response).token;
                const user = (<any> response).user;
                console.log("USER", user.id)
                localStorage.setItem("jwt", token);
                sessionStorage.setItem("name", user.name);
                sessionStorage.setItem("surname", user.surname);
                sessionStorage.setItem("email", user.email);
                sessionStorage.setItem("id", user._id);
                this.router.navigateByUrl('/');
          },
          error: (e) => this.loginInvalid = true
      })
        
    } else {
      this.formSubmitAttempt = true;
    }
  }

}
