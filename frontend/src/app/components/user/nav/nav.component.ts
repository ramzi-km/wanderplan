import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import * as UserActions from '../../../store/user/user.actions';
import * as UserSelector from '../../../store/user/user.selectors';
declare const google: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  theme = 'light';
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    //  this is  just to disable scrolling during navigation.
  }
  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private store: Store,
  ) {}
  private ngUnsubscribe = new Subject<void>();

  user$ = this.store.select(UserSelector.selectUser);
  isLoggedIn$ = this.store.select(UserSelector.selectIsLoggedIn);

  ngOnInit() {
    // Subscribe to the NavigationEnd event of the Router.
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page on each navigation end.
        window.scrollTo(0, 0);
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
  logout(): void {
    this.userAuthService.userLogout().subscribe({
      next: (res) => {
        this.store.dispatch(UserActions.userLogout());
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  shouldShowFooter(): boolean {
    const excludedRoutePattern = /^\/trip\/edit\/.*/;
    // Test if the current route matches the pattern
    const shouldExclude = excludedRoutePattern.test(this.router.url);
    return !shouldExclude;
  }
}
