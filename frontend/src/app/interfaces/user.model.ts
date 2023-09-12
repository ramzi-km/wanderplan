import { ShortTripInfo } from './short-trip.interface';

export interface User {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
  profilePic?: string;
  notifications?: Notification[];
  ban?: boolean;
}
export interface Notification {
  _id?: string;
  type: string;
  content: string;
  timestamp?: Date;
  sender: User;
  trip: ShortTripInfo;
  status?: string;
  read?: boolean;
}
