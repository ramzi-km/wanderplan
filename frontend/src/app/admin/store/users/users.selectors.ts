import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.reducers';

export const selectUsersState = createFeatureSelector<UsersState>('usersState');

// here we are getting the users[]
export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users,
);

// lets fetch the loading here

export const selectLoading = createSelector(
  selectUsersState,
  (state) => state.loading,
);

// lets fetch the error here

export const selectError = createSelector(
  selectUsersState,
  (state) => state.error,
);
