import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  theme = 'light';
  ngOnInit() {
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
    console.log(this.isOpen);
  }

  closeDropdown(): void {
    if (this.isOpen) {
      this.isOpen = false;
      console.log(this.isOpen);
    }
  }
}
