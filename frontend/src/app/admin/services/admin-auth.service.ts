import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Admin } from '../interfaces/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;
  adminLogin(admin: Admin) {
    return this.http.post<{ admin: Admin }>(
      `${this.baseUrl}/admin/login`,
      admin,
    );
  }
  getAdmin() {
    return this.http.get<{ admin: Admin }>(`${this.baseUrl}/admin/data`);
  }
  adminLogout() {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/admin/logout`,
      {},
    );
  }
}
