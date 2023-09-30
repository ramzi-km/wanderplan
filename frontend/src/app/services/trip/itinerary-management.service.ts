import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { ItineraryPlace, Place } from 'src/app/interfaces/trip.interface';

@Injectable({
  providedIn: 'root',
})
export class ItineraryManagementService {
  private baseUrl = environment.API_URL + '/api/trip';
  constructor(private http: HttpClient) {}

  updateSubheading(
    tripId: string,
    itineraryIndex: number,
    body: { subheading: string },
  ) {
    return this.http.patch<{ subheading: string; message: string }>(
      `${this.baseUrl}/edit/${tripId}/itinerary/${itineraryIndex}/subheading`,
      body,
    );
  }
  addPlace(tripId: string, itineraryId: string, body: { place: Place }) {
    return this.http.post<{ place: ItineraryPlace; message: string }>(
      `${this.baseUrl}/${tripId}/itinerary/${itineraryId}/place`,
      body,
    );
  }
  updatePlaceDescription(
    tripId: string,
    dayIndex: number,
    placeIndex: number,
    body: {
      description: string;
    },
  ) {
    return this.http.patch<{ place: ItineraryPlace; message: string }>(
      `${this.baseUrl}/${tripId}/itinerary/${dayIndex}/place/${placeIndex}/description`,
      body,
    );
  }
  updatePlaceNotes(
    tripId: string,
    dayIndex: number,
    placeIndex: number,
    body: {
      notes: string;
    },
  ) {
    return this.http.patch<{ place: ItineraryPlace; message: string }>(
      `${this.baseUrl}/${tripId}/itinerary/${dayIndex}/place/${placeIndex}/note`,
      body,
    );
  }
  updatePlaceImage(
    tripId: string,
    dayIndex: number,
    placeIndex: number,
    body: {
      image: string;
    },
  ) {
    return this.http.patch<{ place: ItineraryPlace; message: string }>(
      `${this.baseUrl}/${tripId}/itinerary/${dayIndex}/place/${placeIndex}/image`,
      body,
    );
  }
  updatePlaceTime(
    tripId: string,
    dayIndex: number,
    placeIndex: number,
    body: {
      time: { startTime: string; endTime: string };
    },
  ) {
    return this.http.patch<{ place: ItineraryPlace; message: string }>(
      `${this.baseUrl}/${tripId}/itinerary/${dayIndex}/place/${placeIndex}/time`,
      body,
    );
  }
  deletePlace(tripId: string, dayIndex: number, placeIndex: number) {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${tripId}/itinerary/${dayIndex}/place/${placeIndex}`,
    );
  }
}
