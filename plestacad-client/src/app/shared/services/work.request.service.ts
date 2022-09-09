import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { UserRole } from '../models/role.enum';

@Injectable({
    providedIn: 'root'
})
export class WorkRequestService {
    uri = environment.apiURL;


    constructor(private http: HttpClient) { }
    getWorkRequestsByUserReceiverId(id: string) {
        return this.http.get<any>(this.uri + 'workRequestsByUserReceiverId/' + id).pipe(
            map((response) => {
                return response;
            })
        );



    }

    
    getWorkRequestsWithInfoByUserReceiverId(id: string){
        return this.http.get<any>(this.uri + 'workRequestsWithInfoByUserReceiverId/' + id).pipe(
            map((response) => {
                return response;
            })
        );
    }

    acceptWorkRequest(id: string, userIdReceiver: string, workId: string, role: string){
        console.log("cuerpo ID trabajo", workId)
        return this.http.post<any>(this.uri + "/worksRequests/accept", {
            id: id,
            userIdReceiver: userIdReceiver,
            workId: workId,
            role: role
        }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    denyWorkRequest(id: string, userIdReceiver: string){
        return this.http.delete<any>(this.uri + "/worksRequests/deny/"+id + "/" + userIdReceiver).pipe(map(res => {
            return res;
        }))
    }
}
