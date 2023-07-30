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
    return this.http.post(`${this.baseUrl}/signUp`, user, {
      withCredentials: true,
    });
  }
  emailVerify(body: { otp: string }) {
    return this.http.post(`${this.baseUrl}/verifySignup`, body, {
      withCredentials: true,
    });
  }
  userLogin(user: User) {
    return this.http.post(`${this.baseUrl}/login`, user, {
      withCredentials: true,
    });
  }
  getUser() {
    return this.http.get(`${this.baseUrl}/user`, {
      withCredentials: true,
    });
  }
  resendOtp() {
    return this.http.post(
      `${this.baseUrl}/resendSignupOtp`,
      {},
      {
        withCredentials: true,
      },
    );
  }
  userLogout() {
    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true },
    );
  }
}
