import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { initFlowbite } from 'flowbite';
import { UserAuthService } from './services/user/user-auth.service';
import * as UserActions from './store/user/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private userAuthService: UserAuthService,
    private store: Store,
  ) {}
  ngOnInit(): void {
    initFlowbite();
  }
}
