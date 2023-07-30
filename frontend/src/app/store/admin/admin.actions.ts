import { createAction, props } from '@ngrx/store';
import { Admin } from 'src/app/interfaces/admin.model';

// load admin
export const getAdmin = createAction('[App Component] getAdmin');
export const getAdminSuccess = createAction(
  '[App Component] getAdminSuccess',
  props<{ admin: Readonly<Admin> }>(),
);
export const getAdminFailure = createAction(
  '[App Component] getAdminFailure',
  props<{ error: any }>(),
);

export const adminLogin = createAction(
  '[AdminLogin Component] adminLogin',
  props<{ admin: Readonly<Admin> }>(),
);
export const adminLogout = createAction('[AdminNav Component] adminLogout');
