import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Work } from 'src/app/shared/models/work.model';
import { saveAs } from 'file-saver';
import { identifierName } from '@angular/compiler';
import { environment } from 'src/environments/environment';

const requestOptions: Object = {
  headers: new HttpHeaders().append('Content-Type', 'application/json'),
  responseType: 'blob',
};

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  uri = environment.apiURL;
  constructor(private http: HttpClient) {}

  getFilesByWorkId(id: string) {
    console.log('ID get files from work', id);
    return this.http.get<any>(this.uri + 'files/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  deleteFile(id: string, path: string) {
    return this.http
      .post<any>(this.uri + '/files/delete/' + id, {
        path: path,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  deleteDir(id: string, path: string) {
    return this.http
      .post<any>(this.uri + '/files/deleteDir/' + id, {
        path: path,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

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
          console.log(response);
          let downloadURL = window.URL.createObjectURL(response);
          saveAs(downloadURL, filename);
        })
      );
  }

  addDirectory(path: string) {
    return this.http
      .post<any>(this.uri + 'files/createDir/', {
        path: path,
      })
      .pipe(
        map((response) => {
          console.log("ERRR", response)
          return response;
        }), catchError(this.handleError)
      );
  }

  handleError(error: any){
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}` ;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    console.log(errorMessage);
    return throwError(() => {
        return errorMessage;
    });
  }

  addFile(id: string, path: string, file: any) {

        let formData = new FormData();    
        formData.append('upload', file);
        formData.append('path', path)
        console.log(formData)
        return this.http.post(this.uri + 'files/add/', formData);
  }
}
