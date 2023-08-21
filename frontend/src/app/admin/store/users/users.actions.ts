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
  props<{ error: string }>(),
);

export const blockUser = createAction(
  '[UserManagement Component]blockUser',
  props<{ id: string }>(),
);
export const blockUserSuccess = createAction(
  '[UserManagement Component] blockUserSuccess',
  props<{ id: string }>(),
);
export const blockUserFailure = createAction(
  '[UserManagement Component] blockUserFailure',
  props<{ error: string }>(),
);
