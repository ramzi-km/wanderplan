import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.model';
import * as UsersActions from './users.actions';

export interface UsersState {
  users: ReadonlyArray<User>;
  loading: boolean;
  error: any;
}
export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,
  // load users
  on(UsersActions.getUsers, (state) => ({ ...state, loading: true })),
  on(UsersActions.getUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users,
  })),
  on(UsersActions.getUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(UsersActions.blockUser, (state) => ({ ...state, loading: true })),
  on(UsersActions.blockUserSuccess, (state, { id }) => ({
    ...state,
    loading: false,
    users: state.users.map((user) =>
      user._id === id ? { ...user, ban: !user.ban } : user,
    ),
  })),
  on(UsersActions.blockUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
