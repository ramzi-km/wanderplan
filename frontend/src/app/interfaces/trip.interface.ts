import { User } from './user.model';

export interface Trip {
  _id?: string;
  admin?: User;
  name?: string;
  startDate?: Date;
  endDate?: Date;
  coverPhoto?: string;
  place?: Place;
  tripMates?: User[];
  invitedTripMates?: string[];
  visibility?: string;
  overview?: Overview;
  itinerary?: Itinerary[];
  budget?: Budget;
  unList?: boolean;
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
  _id?: string;
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
  subheading?: string;
  places?: ItineraryPlace[];
}

export interface ItineraryPlace {
  _id?: string;
  name?: string;
  image: string;
  description?: string;
  note?: string;
  coordinates: [number, number];
  extendedName?: string;
  time?: {
    startTime: Date;
    endTime: Date;
  };
  expense?: string;
}

export interface Budget {
  limit: number;
  expenses: BudgetExpense[];
}
export interface BudgetExpense {
  _id?: string;
  amount?: number;
  category?: Category;
  description?: string;
  date?: Date;
  paidBy?: User;
}

export interface Category {
  _id?: string;
  name?: string;
  icon?: string;
  unList?: boolean;
}
