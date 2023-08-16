import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import * as tripEditActions from 'src/app/store/editingTrip/trip-edit.actions';
import * as tripEditSelector from 'src/app/store/editingTrip/trip-edit.selectors';
import { TripService } from '../services/trip/trip.service';

@Injectable({
  providedIn: 'root',
})
export class TripEditResolver implements Resolve<any> {
  constructor(
    private tripService: TripService,
    private store: Store,
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const tripId = route.paramMap.get('id');
    console.log('object');
    return this.store.select(tripEditSelector.selectEditingTrip).pipe(
      switchMap((tripFromStore) => {
        if (tripFromStore && tripFromStore._id === tripId) {
          return of(tripFromStore); // Return data from the store
        } else {
          return this.tripService.getDetails(tripId!).pipe(
            tap((fetchedTrip: any) => {
              console.log('object');
              if (fetchedTrip?.editable) {
                console.log('object');
                this.store.dispatch(
                  tripEditActions.setTripEdit(fetchedTrip.trip),
                );
              }
            }),
          );
        }
      }),
    );
  }
}
