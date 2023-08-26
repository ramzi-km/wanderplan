import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { ShortTripInfo } from 'src/app/interfaces/short-trip.interface';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  updateUser(user: User) {
    return this.http.patch<{ user: User; message: string }>(
      `${this.baseUrl}/user`,
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
      `${this.baseUrl}/user/uploadProfile`,
      profile,
    );
  }
  getRecentTrips() {
    return this.http.get<{
      recentTrips: ShortTripInfo[];
      upcomingTrips: ShortTripInfo[];
      message: string;
    }>(`${this.baseUrl}/user/getRecentTrips`);
  }
  getAllTrips() {
    return this.http.get<{ trips: ShortTripInfo[] }>(
      `${this.baseUrl}/user/getAllTrips`,
    );
  }
}
