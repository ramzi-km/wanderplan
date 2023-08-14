import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WikipediaService {
  constructor(private http: HttpClient) {}
  getLocationPage(location: string) {
    const trimmedQuery = location.trim();
    return this.http.get(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
        trimmedQuery,
      )}`,
    );
  }
  getExtract(id: number) {
    return this.http.get(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&list=&pageids=${id}&formatversion=2&exsentences=3&exintro=1&explaintext=1`,
    );
  }
}
