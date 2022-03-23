import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Post } from './models/post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
})
export class ForoComponent implements OnInit {
  posts!: Post[];
  public options!: any[] | null;
  public selected!: string;
  public pageSizeOptions!: number[];
  pageSize!: number;
  length!: number;

  pageIndex!: number;
  constructor(
    private userService: UserService,
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.pageSize = 4;
    this.options = [
      { value: 'desc', name: 'Más recientes' },
      { value: 'asc', name: 'Menos recientes' },
      { value: 'favorites', name: 'Favoritos' },
    ];
    this.selected = this.options[0].value;
    var nullEvent = {
      pageIndex: 0,
      pageSize: this.pageSize
    }
    this.getServerData(nullEvent)
    console.log("LONG", this.length)
  }

  getServerData(event: any) {
    //En el evento viene el numero de pagina.
    //El pageSize (elementos por pagina) se especifica al inicio y cambia con el evento.
    //El Length se carga de la respuesta.
    console.log("EVENT", event)
    console.log("Page Size", this.pageSize, "page index", this.pageIndex)
    if(event != null){
      this.pageIndex = event.pageIndex+1;
      this.pageSize = event.pageSize;
    }

    this.postService
      .getPostsByWorkId(this.route.snapshot.params['id'], this.selected, this.pageSize ,this.pageIndex)
      .subscribe((posts) => {
        this.posts = posts.data.elementsInPage;
        this.length = posts.data.numElems;
        this.pageSizeOptions= [this.length/this.length, Math.floor(this.length/2), this.length]

        this.posts.forEach((post) => {
          this.userService
            .getFullNameById(post.authorId)
            .subscribe((fullname) => {
              console.log('FULLNAME', fullname.data.fullname);
              post.authorFullName = fullname.data.fullname;
            });
        });
      });

  }

  onFilterChange(option: any) {
    var nullEvent = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    }
    this.selected = option;
    this.getServerData(null)
  }
}
