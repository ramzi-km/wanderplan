import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, take } from 'rxjs';
import { GuideService } from '../services/guide/guide.service';
import * as guideEditActions from '../store/editingGuide/guide-edit.actions';
import * as guideEditSelectors from '../store/editingGuide/guide-edit.selectors';

export const guideEditGuard: CanActivateFn = (route, state) => {
  const store: Store = inject(Store);
  const router: Router = inject(Router);
  const guideService: GuideService = inject(GuideService);

  return store.select(guideEditSelectors.selectEditingGuide).pipe(
    switchMap((guide) => {
      const guideId = guide?._id;
      const routeId = route.params['id'];
      if (guideId && guideId === routeId) {
        return [true];
      } else {
        return guideService.getEditGuideDetails(routeId).pipe(
          take(1),
          map((res) => {
            store.dispatch(
              guideEditActions.setEditingGuide({ guide: res.guide }),
            );
            return true;
          }),
          catchError((error) => {
            router.navigate(['/home']);
            return of(false);
          }),
        );
      }
    }),
  );
};
