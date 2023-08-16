export interface CreateTrip {
  place: {
    name: string;
    coordinates: Array<number>;
    extendedName: string;
    description: string;
    photoUrl: string;
  };
  startDate: Date;
  endDate: Date;
  visibility: string;
}
