import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditGuideState } from './guide-edit.reducers';

export const selectGuideEditState =
  createFeatureSelector<EditGuideState>('editGuideState');

export const selectEditingGuide = createSelector(
  selectGuideEditState,
  (state) => state.guide,
);

export const selectLoading = createSelector(
  selectGuideEditState,
  (state) => state.loading,
);

export const selectError = createSelector(
  selectGuideEditState,
  (state) => state.error,
);
