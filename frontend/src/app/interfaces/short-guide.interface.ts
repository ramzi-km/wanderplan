import { Place } from './guide.interface';
import { User } from './user.model';

export interface ShortGuideInfo {
  _id?: string;
  name?: string;
  coverPhoto?: string;
  writer?: User;
  place?: Place;
  writersRelation?: string;
  likes?: string[];
  likesCount?: number;
}
