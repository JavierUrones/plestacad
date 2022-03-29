import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Breadcrumb } from 'src/app/shared/models/breadcumb.model';

@Component({
  selector: 'app-manage-work',
  templateUrl: './manage-work.component.html',
  styleUrls: ['./manage-work.component.scss']
})
export class ManageWorkComponent implements OnInit {
  id!: string;
  constructor(private route: ActivatedRoute, private router: Router ) { 
    

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['idWork'];
    console.log("ID", this.id)

    
    
  }


  onClick(event: any){
    this.id = this.route.snapshot.params['idWork'];
    var element = event.target as Element;
    if(element.textContent=="Foro"){
      this.router.navigate(["/trabajos/"+this.id + "/posts"]);

    }
      if(element.textContent=="Información General" || element.textContent=="Archivos" || element.textContent=="Calendario"  ){
      this.router.navigate(["/trabajos/"+this.id]);
    }


  }



}
