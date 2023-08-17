import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as AdminActions from '../store/admin/admin.actions';

export const adminModuleResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  store: Store = inject(Store),
): boolean => {
  console.log('hi');
  store.dispatch(AdminActions.getAdmin());
  return true;
};
