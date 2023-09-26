import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { ShortGuideInfo } from 'src/app/interfaces/short-guide.interface';
import { ShortTripInfo } from 'src/app/interfaces/short-trip.interface';

@Injectable({
  providedIn: 'root',
})
export class ListGuidesService {
  private baseUrl = environment.API_URL + '/api';
  constructor(private http: HttpClient) {}

  getAllGuidesAndItineraries(params?: HttpParams) {
    return this.http.get<{
      guides: ShortGuideInfo[];
      itineraries: ShortTripInfo[];
      message: string;
      page: number;
      lastPage: number;
    }>(`${this.baseUrl}/travelGuides`, { params });
  }
}
