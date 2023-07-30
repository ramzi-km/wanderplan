import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.reducers';

export const selectUserState = createFeatureSelector<UserState>('userState');

// here we are getting the user
export const selectUser = createSelector(
  selectUserState,
  (state) => state.user,
);

// lets fetch the loading here

export const selectLoading = createSelector(
  selectUserState,
  (state) => state.loading,
);
// lets fetch the isLoggedIn here

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state) => state.isLoggedIn,
);

// lets fetch the error here

export const selectError = createSelector(
    selectUserState,
    (state) => state.error
  );