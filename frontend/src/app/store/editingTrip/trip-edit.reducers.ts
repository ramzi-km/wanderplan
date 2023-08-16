import { createReducer, on } from '@ngrx/store';
import { Trip } from 'src/app/interfaces/trip.interface';
import * as tripEditActions from 'src/app/store/editingTrip/trip-edit.actions';

export interface EditTripState {
  trip: Readonly<Trip>;
  loading: boolean;
  error: any;
}

export const initialState: EditTripState = {
  trip: {},
  loading: false,
  error: null,
};

export const editTripReducer = createReducer(
  initialState,
  on(tripEditActions.setTripEdit, (state, { trip }) => ({
    ...state,
    loading: false,
    trip,
  })),
);
