import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AdminAuthService } from '../../services/admin-auth.service';
import * as AdminActions from '../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
})
export class AdminNavComponent {
  theme = 'light';
  logoutLoading = false;
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    // this is just to disable scrolling during navigation.
  }
  constructor(
    private router: Router,
    private store: Store,
    private adminAuthService: AdminAuthService,
  ) {}
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

  showLogoutModal() {
    const adminLogoutModal = document.getElementById(
      'adminLogoutModal',
    ) as HTMLDialogElement;
    adminLogoutModal.showModal();
  }
  closeLogoutModal() {
    const adminLogoutModal = document.getElementById(
      'adminLogoutModal',
    ) as HTMLDialogElement;
    adminLogoutModal.close();
  }

  logout(): void {
    if (!this.logoutLoading) {
      this.logoutLoading = true;
      this.adminAuthService.adminLogout().subscribe({
        next: (res) => {
          this.store.dispatch(AdminActions.adminLogout());
          this.logoutLoading = false;
          this.router.navigate(['/admin/login']);
        },
        error: (errMessage) => {
          this.logoutLoading = false;
          console.log(errMessage);
        },
      });
    }
  }
}
