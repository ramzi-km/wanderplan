export interface User {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
  profilePic?: any;
  notifications?: Array<any>;
  ban?: boolean;
}
