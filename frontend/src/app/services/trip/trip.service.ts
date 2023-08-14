import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { CreateTrip } from 'src/app/interfaces/create-trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  createTrip(data: CreateTrip) {
    return this.http.post(`${this.baseUrl}/trip/create`, data, {
      withCredentials: true,
    });
  }
}
