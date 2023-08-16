import { createAction, props } from '@ngrx/store';
import { Trip } from 'src/app/interfaces/trip.interface';

export const setTripEdit = createAction(
  '[TripEdit Component] setTripEdit',
  props<{ trip: Readonly<Trip> }>(),
);
