import { Inject, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { TripService } from '../services/trip/trip.service';
import * as tripEditActions from '../store/editingTrip/trip-edit.actions';
import * as tripEditSelector from '../store/editingTrip/trip-edit.selectors';

export const tripEditGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);
  const tripService: TripService = inject(TripService);

  return store.select(tripEditSelector.selectEditingTrip).pipe(
    switchMap((trip) => {
      const tripId = trip?._id;
      const routeId = route.params['id'];
      if (tripId && tripId === routeId) {
        return [true];
      } else {
        return tripService.getDetails(routeId).pipe(
          take(1),
          map((res) => {
            store.dispatch(tripEditActions.setTripEdit({ trip: res.trip }));
            return true;
          }),
          catchError((error) => {
            router.navigate(['/home']);
            return of(false);
          }),
        );
      }
    }),
  );
};
