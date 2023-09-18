import { createReducer, on } from '@ngrx/store';
import { Trip } from 'src/app/interfaces/trip.interface';
import * as tripEditActions from 'src/app/store/editingTrip/trip-edit.actions';

export interface EditTripState {
  trip: Readonly<Trip>;
  loading: boolean;
  error: any;
}

export const initialState: EditTripState = {
  trip: {},
  loading: false,
  error: null,
};

export const editTripReducer = createReducer(
  initialState,
  on(tripEditActions.setTripEdit, (state, { trip }) => ({
    ...state,
    loading: false,
    trip,
  })),
  on(tripEditActions.deleteTripEdit, (state) => ({
    trip: {},
    loading: false,
    error: null,
  })),
  on(tripEditActions.updateTripName, (state, { name }) => ({
    ...state,
    trip: {
      ...state.trip,
      name: name,
    },
  })),
  on(tripEditActions.updateVisibility, (state, { visibility }) => ({
    ...state,
    trip: {
      ...state.trip,
      visibility,
    },
  })),
  on(tripEditActions.updateCoverPhoto, (state, { coverPhoto }) => ({
    ...state,
    trip: {
      ...state.trip,
      coverPhoto: coverPhoto,
    },
  })),
  on(tripEditActions.updateDescription, (state, { description }) => ({
    ...state,
    trip: {
      ...state.trip,
      overview: {
        ...state.trip.overview!,
        description: description,
      },
    },
  })),
  on(tripEditActions.updateInvitedTripmates, (state, { invitedTripmates }) => ({
    ...state,
    trip: {
      ...state.trip,
      invitedTripMates: invitedTripmates,
    },
  })),
  on(tripEditActions.updateTripMates, (state, { tripMates }) => ({
    ...state,
    trip: {
      ...state.trip,
      tripMates: tripMates,
    },
  })),
  on(tripEditActions.updateOverviewNotes, (state, { notes }) => ({
    ...state,
    trip: {
      ...state.trip,
      overview: {
        ...state.trip.overview!,
        notes: notes,
      },
    },
  })),
  on(tripEditActions.addPlaceToVisit, (state, { place }) => ({
    ...state,
    trip: {
      ...state.trip,
      overview: {
        ...state.trip.overview!,
        placesToVisit: [...state.trip.overview?.placesToVisit!, place],
      },
    },
  })),
  on(tripEditActions.deletePlaceToVisit, (state, { placeIndex }) => ({
    ...state,
    trip: {
      ...state.trip,
      overview: {
        ...state.trip.overview!,
        placesToVisit: [
          ...state.trip.overview!.placesToVisit!.slice(0, placeIndex),
          ...state.trip.overview!.placesToVisit!.slice(placeIndex + 1),
        ],
      },
    },
  })),
  on(tripEditActions.updatePlaceToVisit, (state, { placeIndex, place }) => ({
    ...state,
    trip: {
      ...state.trip,
      overview: {
        ...state.trip.overview!,
        placesToVisit: state!.trip!.overview!.placesToVisit.map(
          (item, index) => (index === placeIndex ? place : item),
        ),
      },
    },
  })),
  on(tripEditActions.updateSubheading, (state, { dayIndex, subheading }) => ({
    ...state,
    trip: {
      ...state.trip,
      itinerary: state!.trip!.itinerary!.map((item, index) =>
        index === dayIndex ? { ...item, subheading } : item,
      ),
    },
  })),
  on(tripEditActions.addItineraryPlace, (state, { place, dayIndex }) => ({
    ...state,
    trip: {
      ...state.trip,
      itinerary: state!.trip!.itinerary!.map((item, index) =>
        index === dayIndex
          ? { ...item, places: [...(item.places || []), place] }
          : item,
      ),
    },
  })),
  on(
    tripEditActions.updateItineraryPlace,
    (state, { dayIndex, placeIndex, place }) => ({
      ...state,
      trip: {
        ...state.trip,
        itinerary: state!.trip!.itinerary!.map((item, index) =>
          index === dayIndex
            ? {
                ...item,
                places: item.places?.map((p, idx) =>
                  idx === placeIndex ? place : p,
                ),
              }
            : item,
        ),
      },
    }),
  ),
  on(
    tripEditActions.deleteItineraryPlace,
    (state, { dayIndex, placeIndex }) => ({
      ...state,
      trip: {
        ...state.trip,
        itinerary: state!.trip!.itinerary!.map((item, index) =>
          index === dayIndex
            ? {
                ...item,
                places: item.places?.filter((p, idx) => idx !== placeIndex),
              }
            : item,
        ),
      },
    }),
  ),
  on(tripEditActions.updateBudget, (state, { budget }) => ({
    ...state,
    trip: {
      ...state.trip,
      budget: budget,
    },
  })),
);
