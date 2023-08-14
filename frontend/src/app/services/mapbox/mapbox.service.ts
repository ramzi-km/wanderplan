import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class MapboxService {
  private accessToken =environment.MAPBOX_TOKEN;
  constructor(private http: HttpClient) {}
  getLocationData(location: string) {
    const trimmedQuery = location.trim();
    return this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        trimmedQuery,
      )}.json?access_token=${this.accessToken}`,
    );
  }
}
