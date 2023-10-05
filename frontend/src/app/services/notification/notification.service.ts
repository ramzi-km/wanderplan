import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
import { Notification, User } from 'src/app/interfaces/user.model';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private socket: Socket,
    private http: HttpClient,
  ) {}
  // private baseUrl = environment.API_URL + '/api';

  joinNotifications(data: { user: User }) {
    this.socket.emit('joinNotifications', data);
  }
  leaveNotifications(data: { user: User }) {
    this.socket.emit('leaveNotifications', data);
  }

  sendNotification(data: { notification: Notification; receiverId: string }) {
    this.socket.emit('notification', data);
  }

  getNotification() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('new notification', (notification: Notification) => {
        observer.next(notification);
      });
    });
  }
}
