import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminState } from './admin.reducers';

export const selectAdminState = createFeatureSelector<AdminState>('adminState');

// here we are getting the admin
export const selectAdmin = createSelector(
  selectAdminState,
  (state) => state.admin,
);

// lets fetch the loading here

export const selectLoading = createSelector(
  selectAdminState,
  (state) => state.loading,
);
// lets fetch the isLoggedIn here

export const selectIsLoggedIn = createSelector(
  selectAdminState,
  (state) => state.isLoggedIn,
);

// lets fetch the error here

export const selectError = createSelector(
  selectAdminState,
  (state) => state.error,
);
