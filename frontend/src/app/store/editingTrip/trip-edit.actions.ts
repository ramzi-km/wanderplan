import { createAction, props } from '@ngrx/store';
import { PlaceToVisit, Trip } from 'src/app/interfaces/trip.interface';

export const setTripEdit = createAction(
  '[TripEdit Component] setTripEdit',
  props<{ trip: Readonly<Trip> }>(),
);
export const updateTripName = createAction(
  '[TripEdit Component] UpdateName',
  props<{ name: string }>(),
);
export const updateCoverPhoto = createAction(
  '[TripEdit Component] UpdateCoverPhoto',
  props<{ coverPhoto: string }>(),
);
export const updateDescription = createAction(
  '[TripEdit Component] updateDescription',
  props<{ description: string }>(),
);
export const updateOverviewNotes = createAction(
  '[TripEdit Component] updateOverviewNotes',
  props<{ notes: string }>(),
);
export const addPlaceToVisit = createAction(
  '[TripEdit Component] addPlaceToVisit',
  props<{ place: PlaceToVisit }>(),
);
