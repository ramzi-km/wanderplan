import { createAction, props } from '@ngrx/store';
import { Guide, Place, Section } from 'src/app/interfaces/guide.interface';

export const setEditingGuide = createAction(
  '[GuideEdit Component] setEditingGuide',
  props<{ guide: Readonly<Guide> }>(),
);

export const deleteGuideEdit = createAction(
  '[GuideEdit Component] deleteGuide',
);

export const updateCoverPhoto = createAction(
  '[GuideEdit Component] UpdateCoverPhoto',
  props<{ coverPhoto: string }>(),
);

export const updateGuideName = createAction(
  '[GuideEdit Component] UpdateName',
  props<{ name: string }>(),
);

export const updateGeneralTips = createAction(
  '[GuideEdit Component] updateGeneralTips',
  props<{ generalTips: string }>(),
);

export const updateWritersRelation = createAction(
  '[GuideEdit Component] updateWritersRelation',
  props<{ writersRelation: string }>(),
);

export const addSection = createAction(
  '[GuideEdit Component] AddSection',
  props<{ section: Section }>(),
);

export const deleteSection = createAction(
  '[GuideEdit Component] DeleteSection',
  props<{ sectionId: string }>(),
);

export const updateSectionNote = createAction(
  '[GuideEdit Component] UpdateSectionNote',
  props<{ sectionId: string; note: string }>(),
);
export const addPlaceToSection = createAction(
  '[GuideEdit Component] AddPlaceToSection',
  props<{ sectionId: string; place: Place }>(),
);

