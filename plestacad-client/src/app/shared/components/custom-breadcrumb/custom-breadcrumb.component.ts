import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { distinctUntilChanged, filter } from 'rxjs/operators';
import { PostService } from 'src/app/modules/works/foro/post.service';
import { WorkService } from 'src/app/shared/services/work.service';


@Component({
  selector: 'app-custom-breadcrumb',
  templateUrl: './custom-breadcrumb.component.html',
  styleUrls: ['./custom-breadcrumb.component.scss'],
})
/**
 * Define el componente de migas de pan.
 */
export class CustomBreadcrumbComponent implements OnInit {

  /** Titulo del trabajo académico */
  titleWork!: string;
  /** Titulo del tema */
  titlePost!: string;

  /** Array con las migas de pan */
  breadcrumbs: any[] = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private postService: PostService, private workService: WorkService) {
    this.router.events.subscribe((value) => {
      this.breadcrumbs = [];
      this.getContent()
    })

  }
  /**
   * Obtiene el titulo del trabajo académico.
   * @param idWork id del trabajo académico
   */
  async getTitleWork(idWork: string){
    this.workService.getWorkById(idWork).subscribe(async val => {
      this.titleWork = await val.data.title;
    });
  }
/**
 * Obtiene el título del tema
 * @param idPost id del tema.
 */
  async getTitlePost(idPost: string){
     this.postService.getPostById(idPost).subscribe( async val => {
      this.titlePost = await val.data.title;
    })
  }

  /**
   * Calcula el contenido del componente migas de pan junto a los enlaces que debe tener cada uno de los elementos.
   */
  getContent() {
    var route = this.router.url.split("/");

    for (var i = 0; i < route.length; i++) {
      if (route[i] == "trabajos") {
        var element = { label: "Trabajos", url: "/trabajos" }
        this.breadcrumbs.push(element)
        if (route[i + 1] != undefined) {
          //Consultar a base de datos.
          this.getTitleWork(route[i+1])
          var element = { label: "idWork", url: "/trabajos/" + route[i + 1] }
          this.breadcrumbs.push(element)

        }
      }
      if (route[i] == "posts") {
        var element = { label: "Foro", url: "/trabajos/" + route[i - 1] + "/posts" }
        this.breadcrumbs.push(element)
        if (route[i + 1] != undefined) {
           this.getTitlePost(route[i+1])
          var element = { label: "idPost", url: "/trabajos/" + route[i - 2] + "/posts/" + route[i] }
          this.breadcrumbs.push(element);
        }

      }
    }

  }


  ngOnInit(): void {
  
  }
}
