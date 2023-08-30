import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as AdminSelector from '../store/admin/admin.selectors';

export const adminLoginGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);

  return store.select(AdminSelector.selectIsLoggedIn).pipe(
    map((isLoggedIn) => {
      if (!isLoggedIn) {
        return true;
      } else {
        router.navigate(['/admin']);
        return false;
      }
    }),
  );
};
