export interface User {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  mobile?: string;
  profilePic?: string;
  notifications?: Array<any>;
  history?: Array<any>;
  ban?: boolean;
}
