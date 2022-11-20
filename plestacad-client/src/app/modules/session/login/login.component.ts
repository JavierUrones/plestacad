import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
/** Define el componente de inicio de sesión */
export class LoginComponent implements OnInit {


  /** Formulario donde el usuario introduce los campos de inicio de sesión */
  form: FormGroup;
  /** Atributo que determina si los datos del usuario son correctos una vez ha intentando inciar sesión */
  public loginInvalid = false;
  /** Atributo que determina si el usuario ha intentado iniciar sesión */
  private formSubmitAttempt = false;
  /** Mensaje que se muestra cuando ha fallado el inicio de sesión*/
  public loginInvalidMessage = "";
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {


    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {

  }

  /** Se dispara cuando el usuario pulsa sobre el botón de iniciar sesión. Valida los datos del formulario introducidos por el usuario y llama al servicio de login.
   * Si el inicio de sesión se hace correctamente se almacenan los datos del usuario en sessionStorage, en caso contrario, se muestra el mensaje de error.
   */
  onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      const email = this.form.get('email')?.value;
      const password = this.form.get('password')?.value;

      this.authenticationService.login(email, password).subscribe({
        next: (response) => {
          const token = (<any>response).token;
          const user = (<any>response).user;
          localStorage.setItem("jwt", token);
          sessionStorage.setItem("name", user.name);
          sessionStorage.setItem("surname", user.surname);
          sessionStorage.setItem("email", user.email);
          sessionStorage.setItem("id", user._id);

          if (user.isAdmin)
            this.router.navigateByUrl('/admin');
          else
            this.router.navigateByUrl('/trabajos');


        },
        error: (e) => {
          switch (e.error.error) {
            case "not-verified":
              this.loginInvalidMessage = "No se ha verificado todavía esta cuenta de usuario, comprueba la bandeja de entrada de tu correo electrónico para verificarla.";
              break;
            default:
              this.loginInvalidMessage = "Usuario y contraseña no reconocidos";
              break;
          }
          this.loginInvalid = true;
        }
      })

    } else {
      this.formSubmitAttempt = true;
    }
  }

}
