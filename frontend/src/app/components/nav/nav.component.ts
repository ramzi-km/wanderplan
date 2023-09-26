import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { User } from 'src/app/interfaces/user.model';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { UserService } from 'src/app/services/user/user.service';
import * as UserActions from '../../store/user/user.actions';
import * as UserSelector from '../../store/user/user.selectors';
declare const google: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  theme = 'light';
  logoutLoading = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {}
  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private store: Store,
    private userService: UserService,
  ) {
    this.user$ = this.store.select(UserSelector.selectUser);
    this.unreadNotifications$ = this.user$.pipe(
      map((user) => {
        if (user && user.notifications) {
          return user.notifications.some((notification) => !notification.read);
        }
        return false;
      }),
    );
  }
  private ngUnsubscribe = new Subject<void>();

  user$: Observable<User>;
  isLoggedIn$ = this.store.select(UserSelector.selectIsLoggedIn);
  unreadNotifications$: Observable<boolean>;
  acceptIvitationLoading = {
    value: false,
    id: '',
  };
  ngOnInit() {
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }
      });
    if (localStorage.getItem('theme')) {
      this.theme = localStorage.getItem('theme')!;
    }
  }

  toggleDarkMode() {
    if (this.theme == 'light') {
      this.theme = 'dark';
      localStorage.setItem('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.theme = 'light';
      localStorage.setItem('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }

  shouldShowFooter(): boolean {
    const excludedRoutePatterns = [/^\/trip\/edit\/.*/, /^\/guide\/edit\/.*/];
    const currentUrl = this.router.url;

    const shouldExclude = excludedRoutePatterns.some((pattern) =>
      pattern.test(currentUrl),
    );
    return !shouldExclude;
  }

  showLogoutModal() {
    const logoutModal = document.getElementById(
      'logoutModal',
    ) as HTMLDialogElement;
    logoutModal.showModal();
  }
  closeLogoutModal() {
    const logoutModal = document.getElementById(
      'logoutModal',
    ) as HTMLDialogElement;
    logoutModal.close();
  }

  logout(): void {
    if (!this.logoutLoading) {
      this.logoutLoading = true;
      this.userAuthService.userLogout().subscribe({
        next: (res) => {
          this.store.dispatch(UserActions.userLogout());
          this.logoutLoading = true;
          this.closeLogoutModal();
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);
          this.logoutLoading = true;
        },
      });
    }
  }

  acceptTripInvitation(tripId: string, notificationId: string) {
    this.acceptIvitationLoading = {
      value: true,
      id: notificationId,
    };
    this.userService
      .acceptTripInvitation(tripId, notificationId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(UserActions.getUserSuccess({ user: res.user }));
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
}
