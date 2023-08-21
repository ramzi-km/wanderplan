import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import * as UsersActions from '../../store/users/users.actions';
import * as UsersSelectors from '../../store/users/users.selectors';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  constructor(
    private store: Store,
    private toastr: ToastrService,
  ) {
    this.error$ = this.store.select(UsersSelectors.selectError);
  }

  ngOnInit(): void {
    this.store.dispatch(UsersActions.getUsers());
    this.errorSubscription = this.error$.subscribe({
      next: (err) => {
        this.showToast(err.message);
      },
    });
  }
  errorSubscription!: Subscription;
  error$: Observable<any>;
  searchText = '';
  users$ = this.store.select(UsersSelectors.selectUsers);
  loading$ = this.store.select(UsersSelectors.selectLoading);

  blockUser(id: string) {
    this.store.dispatch(UsersActions.blockUser({ id }));
  }
  showToast(message: string) {
    this.toastr.error(message, 'Error!', {
      timeOut: 3000,
    });
  }
  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
