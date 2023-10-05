import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.model';
import * as userActions from './user.actions';

export interface UserState {
  user: Readonly<User>;
  loading: boolean;
  isLoggedIn: boolean;
  error: any;
}

export const initialState: UserState = {
  user: {},
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(userActions.getUser, (state) => ({ ...state, loading: true })),
  on(userActions.getUserSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    isLoggedIn: true,
    user,
  })),
  on(userActions.getUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoggedIn: false,
    error,
  })),
  on(userActions.userLogin, (state, { user }) => {
    return {
      ...state,
      isLoggedIn: true,
      user,
    };
  }),
  on(userActions.addNotification, (state, { notification }) => {
    const updatedUser: User = {
      ...state.user,
      notifications: [notification, ...state.user.notifications!],
    };

    return {
      ...state,
      user: updatedUser,
    };
  }),
  on(userActions.userLogout, (state) => ({
    ...state,
    isLoggedIn: false,
    user: {},
  })),
);
