import { Component, OnInit } from '@angular/core';



export interface ForumTemas {
  title: string;
  author: string;
  numberInteractions: number;
  creationDate: string;
  lastMessageDate: string;

}
const ELEMENT_DATA: ForumTemas[] = [
  {creationDate: '10/10/10', title: "Test Title", author: "Test Author name", lastMessageDate: '10/10/10', numberInteractions: 100},
  {creationDate: '10/10/10', title: "Test Title", author: "Test Author name", lastMessageDate: '10/10/10', numberInteractions: 100},

  {creationDate: '10/10/10', title: "Test Title", author: "Test Author name", lastMessageDate: '10/10/10', numberInteractions: 100},

  {creationDate: '10/10/10', title: "Test Title", author: "Test Author name", lastMessageDate: '10/10/10', numberInteractions: 100},

  {creationDate: '10/10/10', title: "Test Title", author: "Test Author name", lastMessageDate: '10/10/10', numberInteractions: 100}

];
@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss']
})
export class ForoComponent implements OnInit {

  dataSource!: ForumTemas[]
  displayedColumns: string[] = ['creationDate', 'title', 'lastMessageDate', 'numberInteractions'];


  title: string = "test title"
  isFavorite: boolean = true;
  creationDate: Date = new Date();
  message: string = "This is a text message";
  numberInteractions = 100;
  author: string = "James Doe"
  constructor() { }

  ngOnInit(): void {

    this.dataSource = ELEMENT_DATA;
  }

}
