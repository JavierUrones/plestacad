import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthenticationService } from '../session/services/authentication.service';
import { confirmPasswordValidator } from '../session/signup/resources/passwordValidator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {


  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  fileControl!: FormControl ;
  public uploadFiles: any;
  invalidUpload: boolean = false;
  photoProfile!: any;
  changePasswordSuccess : boolean = false;
  changeDataSuccess : boolean = false;
  changePhotoSuccess : boolean = false;
  constructor(private userService: UserService,  private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      email: new FormControl({disabled: true}, [Validators.required]),
      name: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
    } );
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
    }, { validators: confirmPasswordValidator});
    this.fileControl = new FormControl(this.uploadFiles, [Validators.required]);

    this.fileControl.valueChanges.subscribe((files: any) => {
      if (!Array.isArray(files)) {
        this.uploadFiles = [files];
        console.log(this.uploadFiles)
        this.invalidUpload = false;

      } else {
        this.uploadFiles = files;
        console.log(this.uploadFiles)
        this.invalidUpload = false;

      }
    })

    this.getProfilePhoto();
    this.getUserData();
    this.getPasswordData();
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmitData(){
    if(this.profileForm.invalid){
      this.changeDataSuccess = false;

      return;
    }
    this.changeDataSuccess = false;

    const name = this.profileForm.get('name')?.value;
    const surname = this.profileForm.get('surname')?.value;

    this.userService.updateUserData(sessionStorage.getItem("id") as string, name, surname).subscribe((res) => {
      console.log("actualizacion de nombre", res)
      this.getUserData();
      this.changeDataSuccess = true;

    })

  }
  onSubmitPassword(){
    if (this.passwordForm.invalid) {
      this.changePasswordSuccess = false;

      return;
    }
    const newPassword = this.passwordForm.get('password')?.value;
    this.changePasswordSuccess = false;

    this.userService.updateUserPassword(sessionStorage.getItem("id") as string, newPassword).subscribe((res) => {
      console.log("password udpated")
      this.getPasswordData();
      this.passwordForm.reset();
      this.passwordForm.controls["password"].setErrors(null);
      this.passwordForm.controls["repeatPassword"].setErrors(null);
      this.changePasswordSuccess = true;
    })
    
  }

  getProfilePhoto(){
    this.userService.getProfilePhoto(sessionStorage.getItem("id") as string).subscribe((photo) => {
      let objectURL = URL.createObjectURL(photo);       
      this.photoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    })
  }

  getUserData(){
    this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => {
      console.log(res)
      this.profileForm.controls["email"].setValue(res.data.user.email);
      this.profileForm.controls["name"].setValue(res.data.user.name);
      this.profileForm.controls["surname"].setValue(res.data.user.surname);

    })
  }

  getPasswordData(){
    this.userService.getUserById(sessionStorage.getItem("id") as string).subscribe((res) => {
        console.log("test", res.data.user.password)
        this.passwordForm.controls["currentPassword"].setValue(res.data.user.password);
    })
  }

  onClickUploadPhoto(){
    if (this.fileControl.valid) {
      console.log(this.uploadFiles)
      this.changePhotoSuccess = false;

      this.uploadFiles.forEach((element: any) => {       
        this.userService.uploadProfilePhoto(sessionStorage.getItem("id") as string, element).subscribe(res => {
          this.getProfilePhoto();
          this.fileControl.reset();
          this.changePhotoSuccess = true;
        })
      })    
    } else{

      this.invalidUpload = true;
    }
  }

}
