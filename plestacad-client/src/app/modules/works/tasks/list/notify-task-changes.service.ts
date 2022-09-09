import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class NotifyTaskChangesService {
  subjectNotifier: Subject<null> = new Subject<null>();
 
  constructor() { }
 
  notifyChangeTask() {
    this.subjectNotifier.next(null);
  }
}
 