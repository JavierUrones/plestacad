import { Component, Input, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthenticationService } from '../session/services/authentication.service';
import { confirmPasswordValidator } from '../session/signup/resources/passwordValidator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/** Define el componente de perfil del usuario */
export class ProfileComponent implements OnInit {

  /** Formulario de los datos del usuario */
  profileForm!: FormGroup;
  /** Formulario del cambio de contraseña */
  passwordForm!: FormGroup;
  /** Formulario del cambio de foto de perfil */
  fileControl!: FormControl;
  /** Tipos de archivos aceptados para subir */
  accept: string = "image/*";
  /** Archivo subido por el usuario para cambiar la foto de perfil */
  public uploadFiles: any;
  /** Atributo que determina si se ha podido cambiar o no la foto de perfil */
  invalidUpload: boolean = false;
  /** Foto de perfil del usuario */
  photoProfile!: any;
  /** Atributo que determina si una contraseña se ha podido cambiar correctamente */
  changePasswordSuccess: boolean = false;
  /** Atributo que determina si se han podido modificar correctamente los datos del usuario */
  changeDataSuccess: boolean = false;
  /** Atributo que determina si se ha podido modificar la foto de perfil correctamente */
  changePhotoSuccess: boolean = false;
  /** Atributo con el id del usuario del perfil */
  idUser!: string;

  constructor(private route : ActivatedRoute, private userService: UserService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.idUser = this.route.snapshot.params['id'];

    this.profileForm = new FormGroup({
      email: new FormControl({ value: '', disabled: true }, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
    });
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      repeatPassword: new FormControl('', [
        Validators.required
      ])
    }, { validators: confirmPasswordValidator });
    this.fileControl = new FormControl(this.uploadFiles, []);

    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.uploadFiles = [files];
        this.invalidUpload = false;

      } else {
        this.uploadFiles = files;
        this.invalidUpload = false;

      }
    })

    this.getProfilePhoto();
    this.getUserData();
    //this.getPasswordData();
  }

  /* Obtiene el formulario de datos de perfil 
  * @returns Retorna el formulario del perfil.
  */
  get f() {
    return this.profileForm.controls;
  }

  /** Se dispara cuando el usuario guarda los cambios cuando actualiza los datos de su perfil. Valida los datos introducidos por el usuario y llama al servicio de usuarios para actualizarlos. */
  onSubmitData() {
    if (this.profileForm.invalid) {
      this.changeDataSuccess = false;

      return;
    }
    this.changeDataSuccess = false;

    const name = this.profileForm.get('name')?.value;
    const surname = this.profileForm.get('surname')?.value;

    this.userService.updateUserData(this.idUser, name, surname).subscribe((res) => {
      this.getUserData();
      this.changeDataSuccess = true;

    })

    this.userService.updateUserData(this.idUser, name, surname).subscribe({
      next: (response) => {
        this.getUserData();
        this.changeDataSuccess = true;
      },
      error: (e) => {
        this.profileForm.setErrors({ 'invalidData': true })
      }
    })
  }
  /** Se dispara cuando el usuario guarda los cambios cuando actualiza su contraseña. Valida los datos de los campos de contraseñas introducidos por el usuario y llama al servicio de usuarios para actualizar dicha contraseña. */
  onSubmitPassword() {
    if (this.passwordForm.invalid) {
      this.changePasswordSuccess = false;

      return;
    }
    const newPassword = this.passwordForm.get('password')?.value;
    const currentPassword = this.passwordForm.get('currentPassword')?.value;

    this.changePasswordSuccess = false;

    this.userService.updateUserPassword(this.idUser, newPassword, currentPassword).subscribe({
      next: (response) => {
        //this.getPasswordData();
        this.passwordForm.reset();
        this.passwordForm.controls["currentPassword"].setErrors(null);

        this.passwordForm.controls["password"].setErrors(null);
        this.passwordForm.controls["repeatPassword"].setErrors(null);
        this.changePasswordSuccess = true;
      },
      error: (e) => {
        this.passwordForm.setErrors({ 'invalidPassword': true })
      }
    })

  }

  /** Obtiene la foto de perfil del usuario desde el servidor. */
  getProfilePhoto() {
    this.userService.getProfilePhoto(this.idUser).subscribe((photo) => {
      if (photo.type == "image/jpeg") {
        let objectURL = URL.createObjectURL(photo);
        this.photoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      } else {
        this.photoProfile = undefined;
      }

    })
  }

  /** Obtiene los datos del usuario a partir del servicio de usuarios. */
  getUserData() {
    this.userService.getUserById(this.idUser).subscribe((res) => {
      this.profileForm.controls["email"].setValue(res.data.user.email);
      this.profileForm.controls["name"].setValue(res.data.user.name);
      this.profileForm.controls["surname"].setValue(res.data.user.surname);

    })
  }

  /** Se dispara cuando el usuario pulsa el botón de subir nueva imagen. Valida los datos del archivo seleccionado por el usuario y llama al servicio de usuarios para actualizar la fotografía. */
  onClickUploadPhoto() {
    if (this.fileControl.valid) {
      this.changePhotoSuccess = false;

      this.uploadFiles.forEach((element: any) => {
        this.userService.uploadProfilePhoto(this.idUser, element).subscribe(res => {
          this.getProfilePhoto();
          this.fileControl.reset();
          this.changePhotoSuccess = true;
        })
      })
    } else {

      this.invalidUpload = true;
    }
  }

}
