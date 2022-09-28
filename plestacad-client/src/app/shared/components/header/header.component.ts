import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/modules/session/services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username = ""
  surname = ""
  photoProfile!: any;
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer, private authenticationService: AuthenticationService, private router:Router, private userService : UserService) { }

  ngOnInit() { 
     this.username = sessionStorage.getItem('name') as string;
     this.surname = sessionStorage.getItem('surname') as string;
     this.getProfilePhoto();
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  getProfilePhoto(){
    this.userService.getProfilePhoto(sessionStorage.getItem("id") as string).subscribe((photo) => {
      if(photo.type=="image/jpeg"){
        let objectURL = URL.createObjectURL(photo);       
        this.photoProfile = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      } else{
        this.photoProfile = undefined;
      }

    })
  }

  logout(){
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('surname');

      this.authenticationService.logout();
      this.router.navigateByUrl("/login")
  }
}
