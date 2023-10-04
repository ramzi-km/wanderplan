import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip } from 'src/app/interfaces/trip.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItinerariesManagementService {
  private baseUrl = environment.API_URL + '/api/admin';
  constructor(private http: HttpClient) {}

  getAllItineraries(params?: HttpParams) {
    return this.http.get<{
      itineraries: Trip[];
      message: string;
      page: number;
      lastPage: number;
    }>(`${this.baseUrl}/itineraries`, { params });
  }
  toggleUnlistItinerary(itineraryId: string) {
    return this.http.patch<{ itinerary: Trip; message: string }>(
      `${this.baseUrl}/itineraries/${itineraryId}/toggleUnlist`,
      {},
    );
  }
}
