import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { User } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  
  private baseUrl = environment.API_URL

  constructor(private http: HttpClient) {}
  userRegister(user: User) {
    return this.http.post(`${this.baseUrl}/signUp`, user);
  }
}
