import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user.model';
import { UsersService } from 'src/app/services/admin/users.service';
import * as UsersActions from 'src/app/store/admin/users/users.actions';
import * as UsersSelectors from 'src/app/store/admin/users/users.selectors';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  constructor(
    private store: Store,
    private usersService: UsersService,
  ) {}
  ngOnInit(): void {
    this.store.dispatch(UsersActions.getUsers());
  }

  users$ = this.store.select(UsersSelectors.selectUsers);
  loading$ = this.store.select(UsersSelectors.selectLoading);
  error$ = this.store.select(UsersSelectors.selectError);
}
