import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces/user.model';
import { UsersService } from 'src/app/services/admin/users.service';
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
          catchError((error) => of(UsersActions.getUsersFailure({ error }))),
        ),
      ),
    );
  });
}
