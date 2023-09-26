import { Place } from './trip.interface';
import { User } from './user.model';

export interface ShortTripInfo {
  _id?: string;
  name?: string;
  admin?: User;
  startDate?: string;
  endDate?: string;
  coverPhoto?: string;
  totalPlacesToVisit?: number;
  totalItineraryPlaces?: number;
  likesCount: number;
  likes: string[];
  place: Place;
}
