import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Category } from 'src/app/interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get<{ categories: Category[]; message: string }>(
      `${this.baseUrl}/admin/categories`,
    );
  }
  addCategory(body: { categoryName: string; categoryIcon: string }) {
    return this.http.post<{ category: Category; message: string }>(
      `${this.baseUrl}/admin/category`,
      body,
    );
  }
}
