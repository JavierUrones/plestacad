import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para la gestión de los usuarios del sistema.
 */
export class UserService {
  /**
   * URL de la API.
   */
  uri =  environment.apiURL;

  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene un usuario a partir de su id.
   * @param id id del usuario
   * @returns la respuesta del servidor
   */
  getUserById(id: string){
    return this.http.get<any>(this.uri + 'users/' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

    /**
   * Obtiene todos los usuarios del sistema
   * @returns la respuesta del servidor
   */
     getAllUsers(){
      return this.http.get<any>(this.uri + 'users/').pipe(
        map((response) => {
          return response;
        })
      );
    }

  /**
   * Actualiza la contraseña de un usuario
   * @param id id del usuario
   * @param password nueva contraseña del usuario
   * @param currentPassword contraseña actual del usuario
   * @returns la respuesta del servidor
   */
  updateUserPassword(id: string, password: string, currentPassword: string){
    return this.http.put<any>(this.uri + 'users/updatePassword', {
      id: id,
      password: password,
      currentPassword: currentPassword
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Actualiza los datos de un usuario
   * @param id id del usuario
   * @param name nombre del usuario
   * @param surname apellidos del usuario
   * @returns la respuesta del servidor
   */
  updateUserData(id: string, name: string, surname: string){
    return this.http.put<any>(this.uri + 'users/updateData', {
      id: id,
      name: name,
      surname: surname
    }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Obtiene la contraseña de un usuario
   * @param id id del usuario
   * @returns la respuesta del servidor
   */
  getPasswordDataByUserId(id: string){
    return this.http.get<any>(this.uri + 'users/passwordData' + id).pipe(
      map((response) => {
        return response;
      })
    );
  }

  /**
   * Obtiene el nombre completo de un usuario a partir de su id.
   * @param id id del usuario
   * @returns la respuesta del servidor
   */
  getFullNameById(id: string){
      return this.http.get<any>(this.uri + 'users/fullname/' + id).pipe(
        map((response) => {
          return response;
        })
      );
  }

  /**
   * Obtiene la lista de posibles usuarios invitables a un trabajo académico (no deben pertenecer al trabajo ni haber sido invitados previamente).
   * @param workId id del trabajo académico
   * @returns la respuesta del servidor
   */
  getUsersForInvitationByRole(workId: string){
      return this.http.get<any>(this.uri + "users/role/"+workId).pipe(
        map((response) => response.data.map((x: { _id: string, name: string; surname: string; role: string; email: string;}) => {
          var user = new User();
          user.name = x.name;
          user.surname = x.surname;
          user.email = x.email;
          user._id = x._id;
          return user;
         }))
      )
  }

  /**
   * Obtiene un usuario a partir de su correo electrónico.
   * @param email correo electrónico del usuario
   * @returns la respuesta del servidor
   */
  getUserByEmail(email: string){
    return this.http.get<any>(this.uri + "users/email/"+email).pipe(
      map((response) => response.data.map((x: { _id: string, name: string; surname: string; role: string; email: string;}) => {
        var user = new User();
        user.name = x.name;
        user.surname = x.surname;
        user.email = x.email;
        user._id = x._id;
        return user;
       }))
    )
}

/**
 * Obtiene la lista de contactos de un usuario (un contacto debe compartir un trabajo académico al menos con el usuario).
 * @param userId id del usuario
 * @returns la respuesta del servidor
 */
getUserContacts(userId: string){
  return this.http.get<any>(this.uri + 'users/contacts/' + userId).pipe(
    map((response) => {
      return response;
    })
  );
}

/**
 * Actualiza la foto de perfil del usuario.
 * @param userId  id del usuario
 * @param file foto de perfil para actualizar
 * @returns la respuesta del servidor
 */
uploadProfilePhoto(userId: string, file: any){
    let formData = new FormData();    
    formData.append('upload', file);
    formData.append('userId' , userId)
    return this.http.post(this.uri + 'users/profile-photo', formData);
}

/**
 * Devuelve la imagen de perfil de un usuario.
 * @param userId id del usuario
 * @returns la respuesta del servidor junto a la imagen del usuario
 */
getProfilePhoto(userId: string){
  const options = {
    responseType: 'blob' as const,
  };
  return this.http.get<any>(this.uri + 'users/profile-photo/' + userId, {responseType: 'blob' as 'json'}).pipe(
    map((response) => {
      return response;
    })
    
  );
}




}
