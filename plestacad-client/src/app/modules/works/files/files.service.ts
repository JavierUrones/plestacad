import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Work } from 'src/app/shared/models/work.model';
import { saveAs } from 'file-saver';
import { identifierName } from '@angular/compiler';
import { environment } from 'src/environments/environment';

/** Establece opciones para las peticiones relacionadas con la descarga de archivos desde el servidor. */
const requestOptions: Object = {
  headers: new HttpHeaders().append('Content-Type', 'application/json'),
  responseType: 'blob',
};

/** Servicio para la gestión de archivos de un trabajo académico */
@Injectable({
  providedIn: 'root',
})
export class FilesService {
  /** URL de la API */
  uri = environment.apiURL;
  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de archivos y directorios de un trabajo académico
   * @param id - id del trabajo académico
   * @returns Retorna la respuesta del servidor
   */
  getFilesByWorkId(id: string) {
    return this.http.get<any>(this.uri + 'files/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /** Elimina un archivo del trabajo académico
   * @param id - id del trabajo académico
   * @param path - ruta del archivo
   * @param userIdResponsible - usuario responsable de borrar el archivo
   * @returns Retorna la respuesta del servidor
   */
  deleteFile(id: string, path: string, userIdResponsible: string) {
    return this.http
      .post<any>(this.uri + '/files/delete/' + id, {
        path: path,
        userIdResponsible: userIdResponsible
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Elimina un directorio de un trabajo académico
   * @param path - ruta del directorio
   * @param userIdResponsible - id del usuario responsable de borrar el directorio
   * @param workId - id del trabajo académico
   * @returns Retorna la respuesta del servidor
   */
  deleteDir(path: string, userIdResponsible: string, workId: string) {
    return this.http
      .post<any>(this.uri + '/files/deleteDir/' + workId, {
        path: path,
        userIdResponsible: userIdResponsible,
        workId: workId
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  /** Descarga un archivo de los alojados en el trabajo académico
   * @param id - id del trabajo académico
   * @param path - ruta del archivo
   * @param filename - nombre del archivo
   * @returns Retorna la respuesta del servidor
   */
  downloadFile(id: string, path: string, filename: string) {
    return this.http
      .post<any>(
        this.uri + 'files/download/' + id,
        {
          path: path,
        },
        requestOptions
      )
      .pipe(
        map((response) => {
          let downloadURL = window.URL.createObjectURL(response);
          saveAs(downloadURL, filename);
        })
      );
  }

  /**
   * Crea un nuevo directorio en un trabajo académico
   * @param path - ruta del directorio a crear
   * @param userIdResponsible - id del usuario responsable de crear el directorio
   * @param workId - id del trabajo académico
   * @returns Retorna la respuesta del servidor
   */
  addDirectory(path: string, userIdResponsible: string, workId: string) {
    return this.http
      .post<any>(this.uri + 'files/createDir/', {
        path: path,
        userIdResponsible: userIdResponsible,
        workId: workId
      })
      .pipe(
        map((response) => {
          return response;
        }), catchError(this.handleError)
      );
  }

  /** Gestiona el posible error recibido.
   * @param error - error recibido
   */
  handleError(error: any){
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}` ;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => {
        return errorMessage;
    });
  }

  /**
   * Añade un nuevo archivo al trabajo académico
   * @param userIdResponsible - id del usuario responsable de subir el archivo
   * @param path - ruta del archivo a subir
   * @param file - archivo a subir
   * @param workId - id del trabajo académico
   * @returns Retorna la respuesta del servidor
   */
  addFile(userIdResponsible: string, path: string, file: any, workId: string) {

        let formData = new FormData();    
        formData.append('upload', file);
        formData.append('path', path);
        formData.append('userIdResponsible' , userIdResponsible);
        formData.append('workId', workId)
        return this.http.post(this.uri + 'files/add/', formData);
  }
}
