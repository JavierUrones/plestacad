import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map, Observable } from 'rxjs';
import { PostInteraction } from './models/post.interaction';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  uri = "http://localhost:5200/api/";
  constructor(private http: HttpClient) { }



  getInteractionsById(id: string){
    return this.http.get<any>(this.uri + 'posts/interactions/' + id).pipe(map((response => {
      return response;
    })))
  }
  createNewInteraction(id: string, interaction: PostInteraction) {
    return this.http.put<any>(this.uri + "posts/newInteraction/" + id, { interaction: interaction}).pipe(map(response => {
      return response;
    }))
  }
 

  getPostsByWorkId(idWork: string, optionOrder: string, pageSize: number, pageIndex: number) {
    console.log('ID', idWork);
    console.log("URL DE CONSULTA", this.uri + 'posts/' + idWork + "/" + optionOrder + "/" + pageSize + "/" + pageIndex)
    return this.http.get<any>(this.uri + 'posts/' + idWork + "/" + optionOrder + "/" + pageSize + "/" + pageIndex).pipe(
      map((response) => {
        console.log(response)
        return response;
      })
    );
  }
  getPostById(id: string) {
    return this.http.get<any>(this.uri + 'posts/' + id).pipe(map((response => {
      return response;
    })))
  }

  getTotalPostByWorkId(idWork: string) {
    console.log("ID WORK PRE CONMSULT", idWork)
    return this.http.get<any>(this.uri + 'posts/length/' + idWork).pipe(map((response) => {
      return response;
    }))
  }


  createPost(idWork: string, authorId: string, lastMessageDate: Date, creationDate: Date, message: string, title: string, isFavorite: boolean) {
    console.log("IDWORK", idWork)
    return this.http.post<any>(this.uri + 'posts/' + idWork, { idWork: idWork, authorId: authorId, lastMessageDate: lastMessageDate, creationDate: creationDate, message: message, title: title, isFavorite: isFavorite }).pipe(map(response => {
      return response;
    }))
  }

  markPostAsFavorite(idPost: string, isFavorite: boolean) {
    return this.http.put<any>(this.uri + "posts/markFavorite", { id: idPost, isFavorite: isFavorite }).pipe(map(response => {
      return response;
    }))
  }

}