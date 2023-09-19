import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: Socket) {}

  joinRoom(data: { user: User; roomId: string }) {
    this.socket.emit('join', data);
  }
  leaveRoom(data: { user: User; roomId: string }) {
    this.socket.emit('leave', data);
  }
}
