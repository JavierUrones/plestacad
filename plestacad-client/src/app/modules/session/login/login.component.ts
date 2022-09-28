import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerSocketsRequestsService } from 'src/app/shared/services/server-sockets.service';
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
  public loginInvalidMessage = "";
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private serverSocketsRequestsService: ServerSocketsRequestsService
  ) {


    this.form = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {

  }

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
          console.log("USER", user.id)
          localStorage.setItem("jwt", token);
          sessionStorage.setItem("name", user.name);
          sessionStorage.setItem("surname", user.surname);
          sessionStorage.setItem("email", user.email);
          sessionStorage.setItem("id", user._id);
          this.router.navigateByUrl('/trabajos');

        },
        error: (e) => {
          switch (e.error.error) {
            case "not-verified":
              console.log("aqui")
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
