import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Notification, User } from './interfaces/user.model';
import { ErrorEventService } from './services/error-event.service';
import { NotificationService } from './services/notification/notification.service';
import * as userActions from './store/user/user.actions';
import * as userSelectors from './store/user/user.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  theme = 'light';
  private ngUnsubscribe$ = new Subject<void>();
  user!: User;

  constructor(
    private messageService: MessageService,
    private errorEventService: ErrorEventService,
    private store: Store,
    private notificationService: NotificationService,
  ) {}
  show(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
  joinNotifications(user: User) {
    const data = { user };
    this.notificationService.joinNotifications(data);
  }
  leaveNotifications(user: User) {
    const data = { user };
    this.notificationService.leaveNotifications(data);
  }
  newNotification(notification: Notification) {
    this.store.dispatch(userActions.addNotification({ notification }));
    if (notification.type == 'tripInvite') {
      this.messageService.add({
        severity: 'info',
        summary: 'Trip invite',
        detail: notification.content,
      });
    } else if (
      notification.type == 'tripLike' ||
      notification.type == 'guideLike'
    ) {
      this.messageService.add({
        severity: 'info',
        summary: 'Like',
        detail: notification.content,
      });
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('theme')) {
      this.theme = localStorage.getItem('theme')!;
      if (this.theme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    this.errorEventService
      .getErrorObservable()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((message) => {
        this.show(message);
      });

    this.store
      .select(userSelectors.selectUser)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.user = res;
          if (res?._id) {
            this.joinNotifications(res);
          }
        },
      });
    this.notificationService
      .getNotification()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (notification: Notification) => {
          this.newNotification(notification);
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.leaveNotifications(this.user);
  }
}
