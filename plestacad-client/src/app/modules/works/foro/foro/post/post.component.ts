import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
  })
  export class PostComponent implements OnInit {
    @Input() title = '';
    @Input() author = '';
    @Input() message = '';
    @Input() creationDate!: Date;
    @Input() numberInteractions!: number;
    @Input() isFavorite!: boolean;
    constructor() { }
  
    ngOnInit(): void {
    }
  
  }