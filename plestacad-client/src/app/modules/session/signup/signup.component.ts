import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { confirmPasswordValidator } from './resources/passwordValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
/** Define el componente de registro de usuarios */
export class SignupComponent implements OnInit {
  /** Formulario de registro de usuarios */
  registerForm!: FormGroup;
  /** Atributo que determina si se están cargando datos del servidor */
  loading = false;
  /** Determina si el usuario ha pulsado el botón de registrarse  */
  submitted = false;
  /** Mensaje de error del formulario */
  errorMessage = '';
  /** Atributo que determina la validez o no del formulario */
  registerFormInvalid = false;

  /** Atributo que determina si el usuario se ha registrado o no para mostrar el mensaje de que es necesario validar la cuenta */
  public signupDone!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.signupDone = false;
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
    }, { validators: confirmPasswordValidator });
  }


  /** Obtiene el valor del formulario de registro */
  get f() {
    return this.registerForm.controls;
  }

  /** Se dispara cuando el usuario pulsa el botón de registrarse. Se válida el contenido del formulario y se llama al servicio para registrar al usuario. */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    const name = this.registerForm.get('name')?.value;
    const surname = this.registerForm.get('surname')?.value;
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authenticationService
      .signup(name, surname, email, password)
      .subscribe({
        next: (response) => {
          this.signupDone = true;
        },
        error: (e) => {
          this.errorMessage = "Ya existe una cuenta registrada con el email indicado.";
          this.registerFormInvalid = true;
        },
      });

    this.loading = true;
  }
}
