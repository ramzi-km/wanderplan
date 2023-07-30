import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/interfaces/user.model';

// load users
export const getUser = createAction('[App Component] getUser');
export const getUserSuccess = createAction(
  '[App Component] getUserSuccess',
  props<{ user: Readonly<User> }>(),
);
export const getUserFailure = createAction(
  '[App Component] getUserFailure',
  props<{ error: any }>(),
);

export const userLogin = createAction(
  '[Login Component] userLogin',
  props<{ user: Readonly<User> }>(),
);
export const userLogout = createAction('[Nav Component] userLogout');
