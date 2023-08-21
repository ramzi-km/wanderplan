import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { User } from 'src/app/interfaces/user.model';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { UserService } from 'src/app/services/user/user.service';
import * as UserActions from './user.actions';

@Injectable()
export class userEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private userAuthService: UserAuthService,
  ) {}

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActions.getUser),
      switchMap(() =>
        this.userAuthService.getUser().pipe(
          map((res) =>
            UserActions.getUserSuccess({
              user: res.user as Readonly<User>,
            }),
          ),
          catchError((error) => of(UserActions.getUserFailure({ error }))),
        ),
      ),
    );
  });
}
