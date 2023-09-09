import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import {
  Itinerary,
  ItineraryPlace,
  Place,
  Trip,
} from 'src/app/interfaces/trip.interface';

@Injectable({
  providedIn: 'root',
})
export class ItineraryManagementService {
  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  updateSubheading(
    tripId: string,
    itineraryIndex: number,
    body: { subheading: string },
  ) {
    return this.http.patch<{ subheading: string; message: string }>(
      `${this.baseUrl}/trip/edit/${tripId}/itinerary/${itineraryIndex}/subheading`,
      body,
    );
  }
  addPlace(tripId: string, itineraryId: string, body: { place: Place }) {
    return this.http.post<{ place: ItineraryPlace; message: string }>(
      `${this.baseUrl}/trip/${tripId}/itinerary/${itineraryId}/place`,
      body,
    );
  }
}
