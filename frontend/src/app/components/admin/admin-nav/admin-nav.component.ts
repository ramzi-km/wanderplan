import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AdminAuthService } from 'src/app/services/admin/admin-auth.service';
import * as AdminActions from '../../../store/admin/admin.actions';
import * as AdminSelector from '../../../store/admin/admin.selectors';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss'],
})
export class AdminNavComponent implements OnInit {
  theme = 'light';
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
      if (this.theme == 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark-mode');
    }
  }
  toggleDarkMode() {
    if (this.theme == 'light') {
      this.theme = 'dark';
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark-mode');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      this.theme = 'light';
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark-mode');
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
    this.adminAuthService.adminLogout().subscribe({
      next: (res) => {
        this.store.dispatch(AdminActions.adminLogout());
        this.router.navigate(['/admin/login']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
