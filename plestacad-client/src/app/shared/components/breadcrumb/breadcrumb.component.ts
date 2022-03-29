import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { distinctUntilChanged, filter } from 'rxjs/operators';
import { WorkListService } from 'src/app/modules/works/work-list.service';

import { Breadcrumb } from '../../models/breadcumb.model';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[] | undefined;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private workListService: WorkListService) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  titleWork! : string;


  ngOnInit(): void {
    
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      });



  }

  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadCrumb[] = []
  ): IBreadCrumb[] {
    // ... implementation of buildBreadCrumb
    let label =
      route.routeConfig && route.routeConfig.data
        ? route.routeConfig.data['breadcrumb']
        : '';
    let path =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';


    const lastRoutePart = path!.split('/').pop();
    const isDynamicRoute = lastRoutePart!.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart!.split(':')[1];
      path = path!.replace(lastRoutePart!, route.snapshot.params[paramName]);
   
      label = route.snapshot.params[paramName];
        
    }

    const nextUrl = path ? `${url}/${path}` : url;
    console.log("label", label, "url", nextUrl)

  
    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl,
    };


    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
