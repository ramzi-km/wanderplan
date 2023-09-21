import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { createGuide } from 'src/app/interfaces/create-guide.interface';
import { Guide } from 'src/app/interfaces/guide.interface';

@Injectable({
  providedIn: 'root',
})
export class GuideService {
  private baseUrl = environment.API_URL + '/api/guide';
  constructor(private http: HttpClient) {}

  createGuide(data: createGuide) {
    return this.http.post<{ guide: Guide; message: string }>(
      `${this.baseUrl}/create`,
      data,
    );
  }
  getEditGuideDetails(id: string) {
    return this.http.get<{ guide: Guide; message: string }>(
      `${this.baseUrl}/${id}/editGuide`,
    );
  }
}
