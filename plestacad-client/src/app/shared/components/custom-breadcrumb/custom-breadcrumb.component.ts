import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { distinctUntilChanged, filter } from 'rxjs/operators';
import { PostService } from 'src/app/modules/works/foro/foro/post.service';
import { WorkListService } from 'src/app/modules/works/work-list.service';

import { Breadcrumb } from '../../models/breadcumb.model';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-custom-breadcrumb',
  templateUrl: './custom-breadcrumb.component.html',
  styleUrls: ['./custom-breadcrumb.component.scss'],
})
export class CustomBreadcrumbComponent implements OnInit {

  titleWork!: string;
  titlePost!: string;

  breadcrumbs: any[] = [];
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private postService: PostService, private workListService: WorkListService) {
    this.router.events.subscribe((value) => {
      this.breadcrumbs = [];
      this.getContent()
    })

  }



  async getTitleWork(idWork: string){
    this.workListService.getWorkById(idWork).subscribe(async val => {
      this.titleWork = await val.data.title;
    });
  }

  async getTitlePost(idPost: string){
     this.postService.getPostById(idPost).subscribe( async val => {
      this.titlePost = await val.data.title;
    })
  }
  getContent() {
    ///trabajos/623c327bd7cb6eff80124959/posts
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
