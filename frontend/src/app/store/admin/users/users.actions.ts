import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.model';

// load users
export const getUsers = createAction('[UserManagement Component]getUsers');
export const getUsersSuccess = createAction(
  '[UserManagement Component] getUsersSuccess',
  props<{ users: readonly User[] }>(),
);
export const getUsersFailure = createAction(
  '[UserManagement Component] getUsersFailure',
  props<{ error: any }>(),
);
