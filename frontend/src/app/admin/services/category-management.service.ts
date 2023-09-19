import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Category } from 'src/app/interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryManagementService {
  private baseUrl = environment.API_URL + '/api/admin';
  constructor(private http: HttpClient) {}

  getAllCategories() {
    return this.http.get<{ categories: Category[]; message: string }>(
      `${this.baseUrl}/categories`,
    );
  }
  addCategory(body: { categoryName: string; categoryIcon: string }) {
    return this.http.post<{ category: Category; message: string }>(
      `${this.baseUrl}/category`,
      body,
    );
  }
  editCategory(
    categoryId: string,
    body: { categoryName: string; categoryIcon: string },
  ) {
    return this.http.patch<{ category: Category; message: string }>(
      `${this.baseUrl}/category/${categoryId}`,
      body,
    );
  }
  toggleUnlistCategory(categoryId: string) {
    return this.http.patch<{ category: Category; message: string }>(
      `${this.baseUrl}/category/${categoryId}/toggleUnlist`,
      {},
    );
  }
}
