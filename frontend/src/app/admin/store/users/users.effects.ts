import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces/user.model';
import { UsersService } from '../../services/users.service';
import * as UsersActions from './users.actions';

@Injectable()
export class usersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService,
  ) {}

  getUsers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersActions.getUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((res: any) =>
            UsersActions.getUsersSuccess({
              users: res.users as ReadonlyArray<User>,
            }),
          ),
          catchError((res: any) =>
            of(UsersActions.getUsersFailure({ error: res })),
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
        this.usersService.blockUser(action.id).pipe(
          map((res: any) => UsersActions.blockUserSuccess({ id: res.userId })),
          catchError((error: any) => of(UsersActions.blockUserFailure(error))),
        ),
      ),
    ),
  );
}
