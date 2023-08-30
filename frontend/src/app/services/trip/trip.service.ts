import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { CreateTrip } from 'src/app/interfaces/create-trip.interface';
import { Trip } from 'src/app/interfaces/trip.interface';

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
}
