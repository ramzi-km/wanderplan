import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorEventService {
  private errorSubject = new Subject<string>();
  constructor() {}
  getErrorObservable() {
    return this.errorSubject.asObservable();
  }

  triggerError(message: string) {
    this.errorSubject.next(message);
  }
}
