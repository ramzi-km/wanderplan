import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces/user.model';
import { UserManagementService } from '../../services/user-management.service';
import * as UsersActions from './users.actions';

@Injectable()
export class usersEffects {
  constructor(
    private actions$: Actions,
    private userManagementService: UserManagementService,
  ) {}

  getUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.getUsers),
      switchMap(() =>
        this.userManagementService.getUsers().pipe(
          map((res) =>
            UsersActions.getUsersSuccess({
              users: res.users as ReadonlyArray<User>,
            }),
          ),
          catchError((errMessage) =>
            of(UsersActions.getUsersFailure({ error: errMessage })),
          ),
        ),
      ),
    );
  });

  // block or unblock user
  blockUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.blockUser),
      switchMap((action) =>
        this.userManagementService.blockUser(action.id).pipe(
          map((res) => UsersActions.blockUserSuccess({ id: res.userId })),
          catchError((errMessage: string) =>
            of(UsersActions.blockUserFailure({ error: errMessage })),
          ),
        ),
      ),
    ),
  );
}
