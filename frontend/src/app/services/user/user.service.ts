import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { ShortGuideInfo } from 'src/app/interfaces/short-guide.interface';
import { ShortTripInfo } from 'src/app/interfaces/short-trip.interface';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL + '/api/user';

  updateUser(user: User) {
    return this.http.patch<{ user: User; message: string }>(
      `${this.baseUrl}`,
      user,
    );
  }
  resetPassword(body: { newPassword: string; oldPassword: string }) {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/resetPassword`,
      body,
    );
  }
  uploadProfile(profile: { profilePic: string }) {
    return this.http.post<{ user: User; message: string }>(
      `${this.baseUrl}/uploadProfile`,
      profile,
    );
  }
  getUpcomingTrips() {
    return this.http.get<{
      upcomingTrips: ShortTripInfo[];
      message: string;
    }>(`${this.baseUrl}/upcomingTrips`);
  }
  getAllTrips(params?: HttpParams) {
    return this.http.get<{
      trips: ShortTripInfo[];
      page: number;
      lastPage: number;
    }>(`${this.baseUrl}/getAllTrips`, { params });
  }
  getAllGuides(params?: HttpParams) {
    return this.http.get<{
      guides: ShortGuideInfo[];
      page: number;
      lastPage: number;
    }>(`${this.baseUrl}/getAllGuides`, { params });
  }
  searchUsers(searchTerm: string) {
    const url = `${this.baseUrl}/search?username=${searchTerm}`;
    return this.http.get<{ users: User[] }>(url);
  }
  acceptTripInvitation(tripId: string, notificationId: string) {
    const url = `${this.baseUrl}/acceptTripInvitation/${tripId}/${notificationId}`;
    return this.http.post<{ user: User; message: string }>(url, {});
  }
}
