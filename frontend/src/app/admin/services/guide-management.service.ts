import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Guide } from 'src/app/interfaces/guide.interface';

@Injectable({
  providedIn: 'root',
})
export class GuideManagementService {
  private baseUrl = environment.API_URL + '/api/admin';
  constructor(private http: HttpClient) {}

  getAllGuides(params?: HttpParams) {
    return this.http.get<{
      guides: Guide[];
      message: string;
      page: number;
      lastPage: number;
    }>(`${this.baseUrl}/guides`, { params });
  }
  toggleUnlistGuide(guideId: string) {
    return this.http.patch<{ guide: Guide; message: string }>(
      `${this.baseUrl}/guides/${guideId}/toggleUnlist`,
      {},
    );
  }
}
