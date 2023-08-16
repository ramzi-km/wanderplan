import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as tripEditSelector from '../store/editingTrip/trip-edit.selectors';

export const tripEditGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);
  return store.select(tripEditSelector.selectEditingTrip).pipe(
    map((trip) => {
      if (trip?._id) {
        return true;
      } else {
        router.navigate(['trip/view/:id']);
        return false;
      }
    }),
  );
};
