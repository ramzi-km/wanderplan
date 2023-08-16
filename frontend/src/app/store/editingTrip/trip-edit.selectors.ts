import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditTripState } from './trip-edit.reducers';

export const selectTripEditState =
  createFeatureSelector<EditTripState>('editTripState');

export const selectEditingTrip = createSelector(
  selectTripEditState,
  (state) => state.trip,
);

export const selectLoading = createSelector(
  selectTripEditState,
  (state) => state.loading,
);

export const selectError = createSelector(
  selectTripEditState,
  (state) => state.error,
);
