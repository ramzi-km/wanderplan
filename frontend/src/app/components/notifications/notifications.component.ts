import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Notification, User } from 'src/app/interfaces/user.model';
import { UserService } from 'src/app/services/user/user.service';
import * as userActions from '../../store/user/user.actions';
import * as userSelectors from '../../store/user/user.selectors';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private store: Store,
    private router: Router,
  ) {}
  user!: User;
  notifications: Notification[] = [];
  acceptIvitationLoading = {
    value: false,
    id: '',
  };
  private ngUnsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.store
      .select(userSelectors.selectUser)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.notifications = user.notifications!;
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
  }

  acceptTripInvitation(tripId: string, notificationId: string) {
    this.acceptIvitationLoading = {
      value: true,
      id: notificationId,
    };
    this.userService
      .acceptTripInvitation(tripId, notificationId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(userActions.getUserSuccess({ user: res.user }));
          this.acceptIvitationLoading = {
            value: false,
            id: '',
          };
          this.router.navigate(['trip/edit', tripId]);
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.acceptIvitationLoading = {
            value: false,
            id: '',
          };
        },
      });
  }
  markNotifRead(notificationId: string) {
    this.userService
      .markNotifRead(notificationId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(userActions.getUserSuccess({ user: res.user }));
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
  }
  markAllNotifRead() {
    this.userService
      .markAllNotifRead()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(userActions.getUserSuccess({ user: res.user }));
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
