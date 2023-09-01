import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { CreateTrip } from 'src/app/interfaces/create-trip.interface';
import { PlaceToVisit, Trip } from 'src/app/interfaces/trip.interface';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  createTrip(data: CreateTrip) {
    return this.http.post<{ trip: Trip; message: string }>(
      `${this.baseUrl}/trip/create`,
      data,
    );
  }
  getDetails(id: string) {
    return this.http.get<{ trip: Trip; message: string; editable: boolean }>(
      `${this.baseUrl}/trip/getDetails/${id}`,
    );
  }
  changeName(id: string, body: { tripName: string }) {
    return this.http.patch<{ tripName: string; message: string }>(
      `${this.baseUrl}/trip/edit/name/${id}`,
      body,
    );
  }
  changeCoverphoto(id: string, body: { coverPhoto: string }) {
    return this.http.patch<{ coverPhoto: string; message: string }>(
      `${this.baseUrl}/trip/edit/coverPhoto/${id}`,
      body,
    );
  }
  updateDescription(id: string, body: { description: string }) {
    return this.http.patch<{ tripDescription: string; message: string }>(
      `${this.baseUrl}/trip/edit/overview/description/${id}`,
      body,
    );
  }
  updateNotes(id: string, body: { notes: string }) {
    return this.http.patch<{ overviewNotes: string; message: string }>(
      `${this.baseUrl}/trip/edit/overview/notes/${id}`,
      body,
    );
  }
  addPlaceToVisit(id: string, body: { place: PlaceToVisit }) {
    return this.http.put<{ place: PlaceToVisit; message: string }>(
      `${this.baseUrl}/trip/edit/overview/placesToVisit/addPlace/${id}`,
      body,
    );
  }
  deletePlace(tripId: string, placeIndex: number) {
    const url = `${this.baseUrl}/trip/edit/${tripId}/overview/placesToVisit/deletePlace/${placeIndex}`;
    return this.http.delete<{ place: PlaceToVisit; message: string }>(url);
  }
  updatePlaceToVisitPhoto(
    tripId: string,
    placeIndex: number,
    body: { image: string },
  ) {
    return this.http.patch<{ place: PlaceToVisit; message: string }>(
      `${this.baseUrl}/trip/edit/${tripId}/overview/placesToVisit/changePhoto/${placeIndex}`,
      body,
    );
  }
}
