import { createReducer, on } from '@ngrx/store';
import { Admin } from '../../interfaces/admin.model';
import * as adminActions from './admin.actions';

export interface AdminState {
  admin: Readonly<Admin>;
  loading: boolean;
  isLoggedIn: boolean;
  error: any;
}

export const initialState: AdminState = {
  admin: {},
  isLoggedIn: false,
  loading: false,
  error: null,
};

export const adminReducer = createReducer(
  initialState,
  on(adminActions.getAdmin, (state) => ({ ...state, loading: true })),
  on(adminActions.getAdminSuccess, (state, { admin }) => ({
    ...state,
    loading: false,
    isLoggedIn: true,
    admin,
  })),
  on(adminActions.getAdminFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoggedIn: false,
    error,
  })),
  on(adminActions.adminLogin, (state, { admin }) => {
    return {
      ...state,
      isLoggedIn: true,
      admin,
    };
  }),
  on(adminActions.adminLogout, (state) => ({
    ...state,
    isLoggedIn: false,
    admin: {},
  })),
);
