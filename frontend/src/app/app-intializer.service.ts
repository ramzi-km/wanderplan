import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import * as AdminActions from './store/admin/admin.actions';
import * as UserActions from './store/user/user.actions';

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  constructor(
    private actions$: Actions,
    private store: Store,
  ) {}

  async initializeApp(): Promise<void> {
    // Dispatch the getUser action
    this.store.dispatch(UserActions.getUser());
    this.store.dispatch(AdminActions.getAdmin());

    // Wait for the completion of both actions and their effects using forkJoin
    await forkJoin([
      this.actions$.pipe(
        ofType(UserActions.getUserSuccess, UserActions.getUserFailure),
        take(1),
      ),
      this.actions$.pipe(
        ofType(AdminActions.getAdminSuccess, AdminActions.getAdminFailure),
        take(1),
      ),
    ]).toPromise();

    // Both actions and effects are completed, resolve the Promise
    return Promise.resolve();
  }
}
