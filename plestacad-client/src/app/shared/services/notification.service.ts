import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    uri = environment.apiURL;


    constructor(private http: HttpClient) { }


    getNotificationsByUserReceiverId(id: string) {
        return this.http.get<any>(this.uri + 'notification/receiver/' + id).pipe(
            map((response) => {
                return response;
            })
        );
    }


    markAsRead(notificationId: string, userIdReceiver: string) {
        return this.http.post<any>(this.uri + 'notification/markAsRead', { notificationId: notificationId, userIdReceiver: userIdReceiver }).pipe(
            map((response) => {
                return response;
            })
        );

    }


}
