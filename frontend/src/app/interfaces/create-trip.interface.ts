export interface CreateTrip {
  place: {
    name: string;
    coordinates: Array<number>;
    extendedName: string;
  };
  startDate: Date;
  endDate: Date;
  visibility: string;
}
