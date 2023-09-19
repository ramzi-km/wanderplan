import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmojiEvent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Subject, takeUntil } from 'rxjs';
import { Message } from 'src/app/interfaces/message.interface';
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
  @ViewChild('messageInput')
  messageInput!: ElementRef;
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;

  private ngUnsubscribe$ = new Subject<void>();
  showEmojiWindow = false;
  sendMessageForm!: FormGroup;
  messageList: Array<Message> = [];

  constructor(
    private chatService: ChatService,
    fb: FormBuilder,
  ) {
    this.sendMessageForm = fb.group({
      messageText: [''],
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
  ngOnInit(): void {
    const user = {
      _id: this.user?._id,
      name: this.user?.name,
      username: this.user?.username,
      profilePic: this.user?.profilePic,
    };
    this.join(user, this.trip?._id!);
    this.chatService
      .getAllTripMessages(this.trip?._id!)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.messageList = res.messages;
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
    this.chatService
      .getMessage()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (message: Message) => {
          this.messageList.push(message);
          setTimeout(() => {
            this.scrollToBottom();
          }, 100);
        },
      });
  }

  join(user: User, roomId: string) {
    const data = { user, roomId };
    this.chatService.joinRoom(data);
  }
  leave(user: User, roomId: string) {
    const data = { user, roomId };
    this.chatService.leaveRoom(data);
  }
  sendMessage() {
    const messageText = this.sendMessageForm.value.messageText.trim();
    const sender = {
      _id: this.user?._id,
      name: this.user?.name!,
      username: this.user?.username!,
      profilePic: this.user?.profilePic!,
    };
    const time = new Date();
    const data = {
      roomId: this.trip?._id!,
      messageData: { messageText, sender, time },
    };
    if (messageText) {
      this.sendMessageForm.reset();
      this.chatService.sendMessage(data);
      this.chatService
        .storeTripMessage(this.trip?._id!, {
          messageText,
          sender,
          time,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe();
    }
  }
  addEmoji(event: EmojiEvent): void {
    this.messageInput.nativeElement.focus();
    const selectionStart = this.messageInput.nativeElement.selectionStart;
    const currentValue = this.messageInput.nativeElement.value;
    const newValue =
      currentValue.substring(0, selectionStart) +
      event.emoji.native +
      currentValue.substring(selectionStart);
    const messageText = this.sendMessageForm.get('messageText');
    messageText!.patchValue(newValue);
    this.messageInput.nativeElement.selectionStart =
      selectionStart + event.emoji.native!.length;
    this.messageInput.nativeElement.selectionEnd =
      selectionStart + event.emoji.native!.length;
    this.showEmojiWindow = false;
  }
  closeEmojiWindow() {
    this.showEmojiWindow = false;
  }
  ngOnDestroy(): void {
    const user = {
      _id: this.user?._id,
      name: this.user?.name,
      username: this.user?.username,
      profilePic: this.user?.profilePic,
    };
    this.leave(user, this.trip?._id!);
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
