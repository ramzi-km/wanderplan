import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Admin } from 'src/app/interfaces/admin.model';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  constructor(private http: HttpClient) {}
  private baseUrl = environment.API_URL;

  adminLogin(admin: Admin) {
    return this.http.post(`${this.baseUrl}/admin/login`, admin, {
      withCredentials: true,
    });
  }
  getAdmin() {
    return this.http.get(`${this.baseUrl}/admin/data`, {
      withCredentials: true,
    });
  }
  adminLogout() {
    return this.http.post(
      `${this.baseUrl}/admin/logout`,
      {},
      { withCredentials: true },
    );
  }
}
