import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';
import { Message } from 'src/app/interfaces/message.interface';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private socket: Socket,
    private http: HttpClient,
  ) {}
  private baseUrl = environment.API_URL + '/api';

  joinRoom(data: { user: User; roomId: string }) {
    this.socket.emit('join', data);
  }
  leaveRoom(data: { user: User; roomId: string }) {
    this.socket.emit('leave', data);
  }
  sendMessage(data: {
    messageData: { messageText: string; sender: User; time: Date };
    roomId: string;
  }) {
    this.socket.emit('message', data);
  }
  getMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on(
        'new message',
        (messageData: { messageText: string; sender: User; time: Date }) => {
          observer.next(messageData);
        },
      );
    });
  }
  storeTripMessage(tripId: string, body: Message) {
    return this.http.post<{ newMessage: Message; message: string }>(
      `${this.baseUrl}/trip/${tripId}/chat/message`,
      body,
    );
  }
  getAllTripMessages(tripId: string) {
    return this.http.get<{ messages: Message[]; message: string }>(
      `${this.baseUrl}/trip/${tripId}/chat/messages`,
    );
  }
}
