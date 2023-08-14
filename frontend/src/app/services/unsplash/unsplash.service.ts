import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class UnsplashService {
  private accessKey = environment.UNSPLASH_KEY;
  constructor(private http: HttpClient) {}

  getPlacePhotoUrl(location: string) {
    const trimmedQuery = location.trim();
    return this.http.get(
      `https://api.unsplash.com/search/photos?client_id=${this.accessKey}&query=${trimmedQuery}`,
    );
  }
}
