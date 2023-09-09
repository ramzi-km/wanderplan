import { createAction, props } from '@ngrx/store';
import {
  ItineraryPlace,
  PlaceToVisit,
  Trip,
} from 'src/app/interfaces/trip.interface';

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

export const deletePlaceToVisit = createAction(
  '[Overview Component] deletePlaceToVisit',
  props<{ placeIndex: number }>(),
);

export const updatePlaceToVisit = createAction(
  '[Overview Component] updatePlaceToVisit',
  props<{ placeIndex: number; place: PlaceToVisit }>(),
);

export const updateSubheading = createAction(
  '[Itinerary Component] updateSubheading',
  props<{ dayIndex: number; subheading: string }>(),
);

export const addItineraryPlace = createAction(
  '[Itinerary Component] addPlace',
  props<{ place: ItineraryPlace; dayIndex: number }>(),
);

export const updateItineraryPlace = createAction(
  '[Itinerary Component] updatePlace',
  props<{ dayIndex: number; placeIndex: number; place: ItineraryPlace }>(),
);
