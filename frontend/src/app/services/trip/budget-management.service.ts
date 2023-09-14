import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import {
  Budget,
  BudgetExpense,
  Category,
} from 'src/app/interfaces/trip.interface';

@Injectable({
  providedIn: 'root',
})
export class BudgetManagementService {
  private baseUrl = environment.API_URL;
  constructor(private http: HttpClient) {}
  getAllExpenseCategories() {
    const url = `${this.baseUrl}/trip/budget/expenseCategories`;
    return this.http.get<{ categories: Category[]; message: string }>(url);
  }
  addExpense(tripId: string, body: BudgetExpense) {
    const url = `${this.baseUrl}/trip/${tripId}/budget/expense`;
    return this.http.post<{ budget: Budget; message: string }>(url, body);
  }
  setBudget(tripId: string, body: { amount: number }) {
    const url = `${this.baseUrl}/trip/${tripId}/budget/limit`;
    return this.http.post<{ budget: Budget; message: string }>(url, body);
  }
}
