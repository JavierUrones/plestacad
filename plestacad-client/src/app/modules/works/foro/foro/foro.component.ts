import { Component, OnInit } from '@angular/core';



export interface Post {
  title: string;
  author: string;
  numberInteractions: number;
  creationDate: Date;
  isFavorite: boolean;
  message: String;
  lastMessageDate: Date;
}
const ELEMENT_DATA: Post[] = [
  {creationDate: new Date(), title: "Duda sobre la planificación del trabajo.", author: "John Doe", lastMessageDate: new Date(), numberInteractions: 100, isFavorite: true, message: "Buenas, tengo una duda que me acaba de surgir mientras intentaba realizar la planificación. ¿Qué software debo utilizar, Microsoft Project o es válido cualquier otro?"},
  {creationDate: new Date(), title: "Pruebas de carga", author: "John Doe", lastMessageDate: new Date(), numberInteractions: 100, isFavorite: false, message: "¿Cuál es la manera más sencilla de realizar una batería de pruebas de carga? Un saludo."},
  {creationDate: new Date(), title: "Despliegue y cierre del proyecto", author: "James Doe", lastMessageDate: new Date(), numberInteractions: 100, isFavorite: false, message: "¿Cuál es el software más apropiado para realizar el despliegue del proyecto? "},
  {creationDate: new Date(), title: "Duda sobre los contenidos de la memoria", author: "LeBron James", lastMessageDate: new Date(), numberInteractions: 100, isFavorite: false, message: "Saludos, ¿debo incluir todos los diagramas de diseño en la memoria?"}

];
@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss']
})
export class ForoComponent implements OnInit {

  displayedColumns: string[] = ['creationDate', 'title', 'lastMessageDate', 'numberInteractions'];
  posts!: Post[];
  constructor() { }

  ngOnInit(): void {

    this.posts = ELEMENT_DATA;
  }

}
