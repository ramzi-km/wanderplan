import { User } from './user.model';

export interface Guide {
  _id?: string;
  writer?: User;
  name?: string;
  coverPhoto?: string;
  place?: {
    name: string;
    extendedName?: string;
    coordinates: [number, number];
  };
  writersRelation?: string;
  generalTips?: string;
  sections?: Section[];
  likes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Section {
  name?: string;
  note?: string;
  places: Place[];
}

export interface Place {
  name: string;
  image?: string;
  description?: string;
  coordinates: [number, number];
}
