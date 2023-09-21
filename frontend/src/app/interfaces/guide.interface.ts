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
  _id?: string;
  name?: string;
  note?: string;
  places: Place[];
}

export interface Place {
  _id?: string;
  name: string;
  image?: string;
  description?: string;
  coordinates: [number, number];
}
