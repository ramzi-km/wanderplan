import { createReducer, on } from '@ngrx/store';
import { Guide } from 'src/app/interfaces/guide.interface';
import * as guideEditActions from '../editingGuide/guide-edit.actions';

export interface EditGuideState {
  guide: Readonly<Guide>;
  loading: boolean;
  error: any;
}

export const initialState: EditGuideState = {
  guide: {},
  loading: false,
  error: null,
};

export const editGuideReducer = createReducer(
  initialState,
  on(guideEditActions.setEditingGuide, (state, { guide }) => ({
    ...state,
    loading: false,
    guide,
  })),
);
