import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Guide } from 'src/app/interfaces/guide.interface';

@Injectable({
  providedIn: 'root',
})
export class GuideManagementService {
  
  private baseUrl = environment.API_URL + '/api/admin';
  constructor(private http: HttpClient) {}

  getAllGuides() {
    return this.http.get<{ guides: Guide[]; message: string }>(
      `${this.baseUrl}/guides`,
    );
  }
  toggleUnlistGuide(guideId: string) {
    return this.http.patch<{ guide: string; message: string }>(
      `${this.baseUrl}/guide/${guideId}/toggleUnlist`,
      {},
    );
  }
}
