import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducers';

export const selectUserState = createFeatureSelector<UserState>('userState');

// here we are getting the user
export const selectUser = createSelector(
  selectUserState,
  (state) => state.user,
);

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading,
);

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state) => state.isLoggedIn,
);

export const selectError = createSelector(
  selectUserState,
  (state) => state.error,
);
