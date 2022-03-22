import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/modules/session/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  username = ""
  surname = ""
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private authenticationService: AuthenticationService, private router:Router) { }

  ngOnInit() { 
     this.username = sessionStorage.getItem('name') as string;
     this.surname = sessionStorage.getItem('surname') as string;
  }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  logout(){
      localStorage.removeItem('jwt');
      sessionStorage.removeItem('currentUser');
      this.authenticationService.logout();
      this.router.navigateByUrl("/login")
  }
}
