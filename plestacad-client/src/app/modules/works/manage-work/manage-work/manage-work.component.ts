import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { WorkService } from 'src/app/shared/services/work.service';

@Component({
  selector: 'app-manage-work',
  templateUrl: './manage-work.component.html',
  styleUrls: ['./manage-work.component.scss']
})
/** Define el esqueleto de la gestión de un trabajo académico*/
export class ManageWorkComponent implements OnInit {
  /** id  del trabajo académico*/
  id!: string;
  /** Menú de pestañas del trabajo académico */
  @ViewChild("tab", { static: false }) tab!: MatTabGroup;

  titleWork!: string;
  /**
   * Constructor
   * @param route 
   * @param router 
   */
  constructor(private route: ActivatedRoute, private router: Router, private workService: WorkService ) { 
    this.router.events.subscribe(
      params => {
        if(params instanceof NavigationEnd && params.url.split('/')[1] !=undefined
        && params.url.split('/')[2] != undefined && params.url.split('/')[3]==undefined){
          if(this.tab != undefined && this.tab.selectedIndex == 1){
            this.tab.selectedIndex = 0;

          }

        }
      }
  );

  }


  /** Carga el id del trabajo académico consultado */
  ngOnInit(): void {
    this.id = this.route.snapshot.params['idWork'];
    this.workService.getWorkById(this.id).subscribe((response)=> this.titleWork=response.data.title)
  }


  /** Evento que se dispara cuando el usuario pulsa sobre una pestaña del menú de pestañas */
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
