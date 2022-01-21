import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    registerForm!: FormGroup;
    loading = false;
    submitted = false;
    roleControl = new FormControl('', Validators.required);

    roles = [
        {title: 'Estudiante', value: "student"},
        {title: 'Profesor', value: "teacher"}
      ];
      registerFormInvalid = false

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService
    ) { 
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            email: ['', Validators.required],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(8)]],
            repeatPassword: ['', [Validators.required, Validators.minLength(8)]]

        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        const name =  this.registerForm.get('name')?.value;
        const surname =  this.registerForm.get('surname')?.value;
        const role =  this.registerForm.get('role')?.value;

        const email = this.registerForm.get('email')?.value;
        const password = this.registerForm.get('password')?.value;

        this.authenticationService.signup(name, surname, email, password, role).subscribe({
            next: (response) => {
              console.log("RESPUESTA", response);
                  const token = (<any> response).token;
                  localStorage.setItem("jwt", token);
                  console.log("User is logged in " + token);
                  this.router.navigateByUrl('/');
            },
            error: (e) => this.registerFormInvalid = true
        })

        this.loading = true;
    }
}
