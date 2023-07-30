import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UserActions from '../../../store/user/user.actions';
import * as UserSelecter from '../../../store/user/user.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private store: Store) {}
  user$ = this.store.select(UserSelecter.selectUser);
  isLoggedIn$ = this.store.select(UserSelecter.selectIsLoggedIn);
  
}
