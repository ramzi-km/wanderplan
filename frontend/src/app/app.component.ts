import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  theme = 'light';
  constructor(
  ) {}
  ngOnInit(): void {
    initFlowbite();
    if (localStorage.getItem('theme')) {
      this.theme = localStorage.getItem('theme')!;
      if (this.theme == 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }
}
