import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  sideBarOpen = true;
  showContent = true;
  
  constructor() {

  }

  ngOnInit(): void {
    this.showContent = true;

  }



  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }


  onClickedMenuItem(event: any){
    this.sideBarOpen = false;
    this.showContent = true;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(window.innerWidth < 800){
      if(this.sideBarOpen){
        this.showContent=false;
      } else{
        this.showContent=true;
      }
    } else{
      this.showContent = true;
    }
  }




}
