import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from 'src/app/shared/models/breadcumb.model';

@Component({
  selector: 'app-manage-work',
  templateUrl: './manage-work.component.html',
  styleUrls: ['./manage-work.component.scss']
})
export class ManageWorkComponent implements OnInit {
  id!: string;
  @ViewChild("tab", { static: false }) tab!: MatTabGroup;

  constructor(private route: ActivatedRoute, private router: Router ) { 
    this.router.events.subscribe(
      params => {
        if(params instanceof NavigationEnd && params.url.split('/')[1] !=undefined
        && params.url.split('/')[2] != undefined && params.url.split('/')[3]==undefined){
          if(this.tab != undefined && this.tab.selectedIndex == 1){
            this.tab.selectedIndex = 0;

          }
          console.log("PARAMS", params.url.split('/') )

        }
        
        //

      }
  );

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['idWork'];
    
    
    
  }


  onClick(event: any){
    this.id = this.route.snapshot.params['idWork'];
    var element = event.target as Element;
    if(element.textContent=="Foro"){
      this.router.navigate(["/trabajos/"+this.id + "/posts"]);

    }
      if(element.textContent=="Información General" || element.textContent=="Archivos" || element.textContent=="Calendario" || element.textContent=="Tareas" ){
      this.router.navigate(["/trabajos/"+this.id]);
    }


  }



}
