import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface CategoryExpenditure {
  _id: string;
  totalAmount: number;
}

interface PopularDestination {
  _id: string;
  totalTrips: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private baseUrl = environment.API_URL + '/api/admin/dashboard';
  constructor(private http: HttpClient) {}

  getGeneralDetails() {
    return this.http.get<{
      totalUsers: number;
      totalTrips: number;
      totalGuides: number;
      totalUnverifiedUsers: number;
    }>(`${this.baseUrl}/general`);
  }
  getMonthlyUsers() {
    return this.http.get<{ monthlyUsers: number[] }>(
      `${this.baseUrl}/monthlyUsers`,
    );
  }
  getCategoryWiseExpenditure() {
    return this.http.get<{ categoryWiseExpenditure: CategoryExpenditure[] }>(
      `${this.baseUrl}/categoryWiseExpenditure`,
    );
  }

  getPopularDestinations() {
    return this.http.get<{ popularDestinations: PopularDestination[] }>(
      `${this.baseUrl}/popularDestinations`,
    );
  }
}
