import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MapboxGeocodingResponse } from 'src/app/interfaces/mapbox-interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private accessToken = environment.MAPBOX_TOKEN;
  constructor(private http: HttpClient) {}
  getLocationData(location: string) {
    const trimmedQuery = location.trim();
    return this.http.get<MapboxGeocodingResponse>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        trimmedQuery,
      )}.json?access_token=${this.accessToken}`,
    );
  }
}
