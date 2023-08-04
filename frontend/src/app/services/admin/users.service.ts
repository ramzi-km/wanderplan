import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get(`${this.baseUrl}/admin/allUsers`, {
      withCredentials: true,
    });
  }
}
