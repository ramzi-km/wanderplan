export interface Message {
  messageText: string;
  sender: {
    _id?: string;
    name: string;
    username: string;
    profilePic: string;
  };
  roomId?: string;
  time: Date;
}
