import { createReducer, on } from '@ngrx/store';
import { Guide, Section } from 'src/app/interfaces/guide.interface';
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
  on(guideEditActions.deleteGuideEdit, (state) => ({
    guide: {},
    loading: false,
    error: null,
  })),
  on(guideEditActions.updateCoverPhoto, (state, { coverPhoto }) => ({
    ...state,
    guide: {
      ...state.guide,
      coverPhoto: coverPhoto,
    },
  })),
  on(guideEditActions.updateGuideName, (state, { name }) => ({
    ...state,
    guide: {
      ...state.guide,
      name: name,
    },
  })),
  on(guideEditActions.updateGeneralTips, (state, { generalTips }) => ({
    ...state,
    guide: {
      ...state.guide,
      generalTips: generalTips,
    },
  })),

  on(guideEditActions.updateWritersRelation, (state, { writersRelation }) => ({
    ...state,
    guide: {
      ...state.guide,
      writersRelation: writersRelation,
    },
  })),
  on(guideEditActions.addSection, (state, { section }) => ({
    ...state,
    guide: {
      ...state.guide,
      sections: [...state.guide.sections!, section],
    },
  })),
  on(guideEditActions.deleteSection, (state, { sectionId }) => ({
    ...state,
    guide: {
      ...state.guide,
      sections: state.guide.sections!.filter(
        (s: Section) => s._id !== sectionId,
      ),
    },
  })),
  on(guideEditActions.updateSectionNote, (state, { sectionId, note }) => {
    const updatedSections = state.guide.sections!.map((section) => {
      if (section._id === sectionId) {
        return {
          ...section,
          note: note,
        };
      } else {
        return section;
      }
    });
    const updatedGuide = {
      ...state.guide,
      sections: updatedSections,
    };
    return {
      ...state,
      guide: updatedGuide,
    };
  }),

  on(guideEditActions.addPlaceToSection, (state, { sectionId, place }) => {
    const updatedSections = state.guide.sections!.map((section) => {
      if (section._id === sectionId) {
        return {
          ...section,
          places: [...section.places, place],
        };
      } else {
        return section;
      }
    });
    const updatedGuide = {
      ...state.guide,
      sections: updatedSections,
    };
    return {
      ...state,
      guide: updatedGuide,
    };
  }),
);
