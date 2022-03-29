import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { confirmPasswordValidator } from './resources/passwordValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  roleControl = new FormControl('', Validators.required);
  errorMessage = '';
  roles = [
    { title: 'Estudiante', value: 'student' },
    { title: 'Profesor', value: 'teacher' },
  ];
  registerFormInvalid = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      repeatPassword: new FormControl('', [
        Validators.required
      ]),
    }, { validators: confirmPasswordValidator});
  }

 
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    const name = this.registerForm.get('name')?.value;
    const surname = this.registerForm.get('surname')?.value;
    const role = this.registerForm.get('role')?.value;

    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authenticationService
      .signup(name, surname, email, password, role)
      .subscribe({
        next: (response) => {
          console.log("Execute authentication")
          const token = (<any>response).token;
          localStorage.setItem('jwt', token);
          console.log('User is logged in ' + token);
          this.router.navigateByUrl('/');
        },
        error: (e) => {
          this.errorMessage = e.error.error;
          this.registerFormInvalid = true;
        },
      });

    this.loading = true;
  }
}
