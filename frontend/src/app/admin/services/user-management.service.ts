import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { User } from 'src/app/interfaces/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private baseUrl = environment.API_URL + '/api/admin';
  constructor(private http: HttpClient) {}
  getUsers() {
    return this.http.get<{ users: User[]; message: string }>(
      `${this.baseUrl}/allUsers`,
    );
  }
  blockUser(id: string) {
    return this.http.patch<{ message: string; userId: string }>(
      `${this.baseUrl}/blockUser/${id}`,
      {},
    );
  }
}
