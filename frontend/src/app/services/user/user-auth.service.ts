import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { User } from '../../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  userRegister(user: User) {
    return this.http.post<{ message: string }>(`${this.baseUrl}/signUp`, user);
  }
  emailVerify(body: { otp: string }) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/verifySignup`, body);
  }
  userLogin(user: User) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/login`, user);
  }
  getUser() {
    return this.http.get<{ user: User }>(`${this.baseUrl}/user`);
  }
  resendOtp() {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/resendSignupOtp`,
      {},
    );
  }
  userLogout() {
    return this.http.post<{ message: string }>(`${this.baseUrl}/logout`, {});
  }
}
