import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { User } from '../../interfaces/user.model';
declare const google: any;
@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL + '/api';

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
  forgotPassword(body: { email: string }) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/forgotPassword`,
      body,
    );
  }
  forgotPasswordVerify(body: { otp: string }) {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/forgotPasswordVerify`,
      body,
    );
  }
  resetForgotPassword(body: { password: string }) {
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/resetForgotPassword`,
      body,
    );
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

  googleLogin(body: { token: string }) {
    return this.http.post<{ user: User }>(`${this.baseUrl}/googleLogin`, body);
  }
}
