import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  updateUser(user: User) {
    return this.http.patch(`${this.baseUrl}/user`, user, {
      withCredentials: true,
    });
  }
  uploadProfile(profile: { profilePic: string }) {
    return this.http.post(`${this.baseUrl}/user/uploadProfile`, profile, {
      withCredentials: true,
    });
  }
  getRecentTrips() {
    return this.http.get(`${this.baseUrl}/user/getRecentTrips`, {
      withCredentials: true,
    });
  }
  getAllTrips() {
    return this.http.get(`${this.baseUrl}/user/getAllTrips`, {
      withCredentials: true,
    });
  }
}
