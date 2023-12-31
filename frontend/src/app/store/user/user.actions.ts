import { createAction, props } from '@ngrx/store';
import { Notification, User } from 'src/app/interfaces/user.model';

// load user
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

export const addNotification = createAction(
  '[App Component] AddNotification',
  props<{ notification: Notification }>(),
);
