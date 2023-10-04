import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Budget,
  BudgetExpense,
  Category,
} from 'src/app/interfaces/trip.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetManagementService {
  private baseUrl = environment.API_URL + '/api/trip';
  constructor(private http: HttpClient) {}
  getAllExpenseCategories() {
    const url = `${this.baseUrl}/budget/expenseCategories`;
    return this.http.get<{ categories: Category[]; message: string }>(url);
  }
  setBudget(tripId: string, body: { amount: number }) {
    const url = `${this.baseUrl}/${tripId}/budget/limit`;
    return this.http.post<{ budget: Budget; message: string }>(url, body);
  }
  addExpense(tripId: string, body: BudgetExpense) {
    const url = `${this.baseUrl}/${tripId}/budget/expense`;
    return this.http.post<{ budget: Budget; message: string }>(url, body);
  }
  deleteExpense(tripId: string, expenseId: string) {
    const url = `${this.baseUrl}/${tripId}/budget/expense/${expenseId}`;
    return this.http.delete<{ budget: Budget; message: string }>(url);
  }
}
