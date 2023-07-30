import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Admin } from 'src/app/interfaces/admin.model';
import { AdminAuthService } from 'src/app/services/admin/admin-auth.service';
import * as AdminActions from './admin.actions';

@Injectable()
export class adminEffects {
  constructor(
    private actions$: Actions,
    private adminAuthService: AdminAuthService,
  ) {}

  getAdmin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AdminActions.getAdmin),
      switchMap(() =>
        this.adminAuthService.getAdmin().pipe(
          map((admin) =>
            AdminActions.getAdminSuccess({
              admin: admin as Readonly<Admin>,
            }),
          ),
          catchError((error) => of(AdminActions.getAdminFailure({ error }))),
        ),
      ),
    );
  });
}
