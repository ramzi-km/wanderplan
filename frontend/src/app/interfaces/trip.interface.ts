import { User } from './user.model';

export interface Trip {
  _id?: string;
  userId?: User;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  coverPhoto?: string;
  place?: Place;
  tripMates?: User[];
  visibility?: string;
  overview?: Overview;
  itinerary?: Itinerary[];
  budget?: Budget;
}

export interface Place {
  name: string;
  extendedName: string;
  coordinates: [number, number];
}

export interface Overview {
  description: string;
  notes: string;
  placesToVisit: PlaceToVisit[];
}

export interface PlaceToVisit {
  coordinates?: [number, number];
  name?: string;
  extendedName?: string;
  image?: string;
  description?: string;
  note?: string;
  index?: number;
}

export interface Itinerary {
  _id?: string;
  Date: Date;
  subHeading: string;
  places: ItineraryPlace[];
}

export interface ItineraryPlace {
  name: string;
  image: string;
  description: string;
  note: string;
  coordinates: number[];
  extendedName: string;
  startTime?: Date;
  endTime?: Date;
  expense?: string;
}

export interface Budget {
  limit: number;
  expenses: string[];
}
