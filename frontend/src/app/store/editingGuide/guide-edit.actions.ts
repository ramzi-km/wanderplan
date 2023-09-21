import { createAction, props } from '@ngrx/store';
import { Guide } from 'src/app/interfaces/guide.interface';

export const setEditingGuide = createAction(
  '[GuideEdit Component] setEditingGuide',
  props<{ guide: Readonly<Guide> }>(),
);
