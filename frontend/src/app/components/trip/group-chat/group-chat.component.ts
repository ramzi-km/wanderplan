import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Trip } from 'src/app/interfaces/trip.interface';
import { User } from 'src/app/interfaces/user.model';
import { ChatService } from 'src/app/services/chat/chat.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss'],
})
export class GroupChatComponent implements OnInit, OnDestroy {
  @Input() trip: Trip | undefined;
  @Input() user!: User | null;

  private ngUnsubscribe$ = new Subject<void>();

  constructor(private chatService: ChatService) {}
  ngOnInit(): void {
    this.join(this.user!, this.trip?._id!);
  }

  join(user: User, roomId: string) {
    const data = { user, roomId };
    this.chatService.joinRoom(data);
  }
  leave(user: User, roomId: string) {
    const data = { user, roomId };
    this.chatService.leaveRoom(data);
  }
  ngOnDestroy(): void {
    this.leave(this.user!, this.trip?._id!);
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
