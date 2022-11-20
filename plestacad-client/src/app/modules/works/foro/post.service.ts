import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PostInteraction } from './models/post.interaction';

@Injectable({
  providedIn: 'root'
})
/** Servicio del foro de los trabajos académicos */
export class PostService {


  /** URL de la API  */
  uri = environment.apiURL;
  constructor(private http: HttpClient) { }



  /**
   * Elimina una respuesta a un tema del foro.
   * @param id - id de la respuesta
   * @param idPost - id del tema del foro
   * @returns Retorna la respuesta del servidor
   */
  deleteInteraction(id: string | undefined, idPost: string) {
    return this.http.delete<any>(this.uri + "posts/interaction/" + id + "/" + idPost).pipe(map(response => {
      return response;
    }))
  }

  /**
   * Elimina un tema del trabajo académico.
   * @param id - id del tema.
   * @returns Retorna la respuesta del servidor
   */
  deletePost(id: string) {
    return this.http.delete<any>(this.uri + "posts/" + id).pipe(map(response => {
      return response;
    }))
  }

  /**
   * Obtiene la lista de respuestas a un tema a partir de su id.
   * @param id - id del tema
   * @returns Retorna la respuesta del servidor
   */
  getListInteractionsByPostId(id: string) {
    return this.http.get<any>(this.uri + "posts/listInteractions/" + id).pipe(map(response => {
      return response;
    }))
  }

  /**
   * Obtiene una respuesta a partir de su id
   * @param id - id de la respuesta del tema
   * @returns Retorna la respuesta del servidor
   */
  getInteractionsById(id: string) {
    return this.http.get<any>(this.uri + 'posts/interactions/' + id).pipe(map((response => {
      return response;
    })))
  }
  /**
   * Crea una nueva respuesta
   * @param id  - id del tema en el que se generará la respuesta
   * @param interaction - datos de la respuestas
   * @returns Retorna la respuesta del servidor
   */
  createNewInteraction(id: string, interaction: PostInteraction) {
    return this.http.put<any>(this.uri + "posts/newInteraction/" + id, { interaction: interaction }).pipe(map(response => {
      return response;
    }))
  }

  /**
   * Obtiene la lista de temas a partir del id del trabajo académico.
   * @param idWork - id del trabajo académico
   * @param optionOrder - opción de orden de los temas (ascendente, descendente, favoritos)
   * @param pageSize - tamaño de la página del paginador.
   * @param pageIndex - número de la página del paginador.
   * @returns Retorna la respuesta del servidor
   */
  getPostsByWorkId(idWork: string, optionOrder: string, pageSize: number, pageIndex: number) {
    return this.http.get<any>(this.uri + 'posts/' + idWork + "/" + optionOrder + "/" + pageSize + "/" + pageIndex).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Obtiene un tema a partir de su id
   * @param id - id del tema
   * @returns Retorna la respuesta del servidor
   */
  getPostById(id: string) {
    return this.http.get<any>(this.uri + 'posts/' + id).pipe(map((response => {
      return response;
    })))
  }

  /**
   * Obtiene el número total de temas de un trabajo académico
   * @param idWork - id del trabajo académico
   * @returns Retorna la respuesta del servidor
   */
  getTotalPostByWorkId(idWork: string) {
    return this.http.get<any>(this.uri + 'posts/length/' + idWork).pipe(map((response) => {
      return response;
    }))
  }

/**
 * Crea un nuevo tema en el foro del trabajo académico.
 * @param idWork - id del trabajo académico
 * @param authorId - id del usuario author del trabajo
 * @param lastMessageDate - fecha de la última respuesta del tema
 * @param creationDate - fecha de creación del tema
 * @param message - contenido del tema
 * @param title - título del tema
 * @param isFavorite - atributo que determina si un trabajo es marcado como favorito o no.
 * @returns Retorna la respuesta del servidor
 */
  createPost(idWork: string, authorId: string, lastMessageDate: Date, creationDate: Date, message: string, title: string, isFavorite: boolean) {
    return this.http.post<any>(this.uri + 'posts/' + idWork, { idWork: idWork, authorId: authorId, lastMessageDate: lastMessageDate, creationDate: creationDate, message: message, title: title, isFavorite: isFavorite }).pipe(map(response => {
      return response;
    }))
  }

  /**
   * Marca/desmarca un tema como favorito.
   * @param idPost - id del tema
   * @param isFavorite - atributo que determina si un tema es favorito o no
   * @returns Retorna la respuesta del servidor
   */
  markPostAsFavorite(idPost: string, isFavorite: boolean) {
    return this.http.put<any>(this.uri + "posts/markFavorite", { id: idPost, isFavorite: isFavorite }).pipe(map(response => {
      return response;
    }))
  }

}
