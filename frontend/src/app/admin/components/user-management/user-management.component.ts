import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as UsersActions from '../../store/users/users.actions';
import * as UsersSelectors from '../../store/users/users.selectors';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(UsersActions.getUsers());
  }
  searchText = '';
  users$ = this.store.select(UsersSelectors.selectUsers);
  loading$ = this.store.select(UsersSelectors.selectLoading);

  blockUser(id: string) {
    this.store.dispatch(UsersActions.blockUser({ id }));
  }
  ngOnDestroy(): void {}
}
