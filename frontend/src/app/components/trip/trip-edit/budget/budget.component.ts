import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Category, Trip } from 'src/app/interfaces/trip.interface';
import { BudgetManagementService } from 'src/app/services/trip/budget-management.service';
import * as tripEditActions from '../../../../store/editingTrip/trip-edit.actions';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
})
export class BudgetComponent implements OnInit, OnDestroy {
  @Input() trip: Trip | undefined;

  private ngUnsubscribe$ = new Subject<void>();
  expenseCategories!: Category[];
  addExpenseForm: FormGroup;
  setBudgetForm: FormGroup;
  addExpenseErrMessage = '';
  addExpenseLoading = false;
  dates: Date[] = [];
  totalAmount = 0;
  setBudgetErrorMessage = '';
  setBudgetLoading = false;

  constructor(
    private budgetManagementService: BudgetManagementService,
    fb: FormBuilder,
    private store: Store,
  ) {
    this.addExpenseForm = fb.group({
      amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paidBy: [null, Validators.required],
    });
    this.setBudgetForm = fb.group({
      amount: ['', [Validators.required]],
    });
  }
  customMinLength(minLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value) {
        const valueWithoutSpaces = control.value.trim();
        if (valueWithoutSpaces.length < minLength) {
          return { customMinLength: { requiredLength: minLength } };
        }
      }
      return null;
    };
  }
  ngOnInit(): void {
    this.trip?.itinerary?.forEach((day) => {
      this.dates.push(day.Date);
    });
    this.trip?.budget?.expenses.forEach((expense) => {
      if (expense?.amount) this.totalAmount += expense.amount!;
    });
    this.budgetManagementService
      .getAllExpenseCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.expenseCategories = res.categories;
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
  }
  showAddExpenseModal() {
    this.addExpenseForm.reset();
    this.addExpenseErrMessage = '';
    const addExpenseModal = document.getElementById(
      'addExpenseModal',
    ) as HTMLDialogElement;
    addExpenseModal.showModal();
  }
  closeAddExpenseModal() {
    const addExpenseModal = document.getElementById(
      'addExpenseModal',
    ) as HTMLDialogElement;
    addExpenseModal.close();
  }
  submitAddExpenseForm() {
    const { amount, description, category, date, paidBy } =
      this.addExpenseForm.value;
    if (amount.toString().trim().length <= 0) {
      this.addExpenseErrMessage = 'amount is required';
      return;
    }
    if (description.trim().length < 3) {
      this.addExpenseErrMessage = 'description must be atleast 3 characters';
      return;
    }
    if (!category) {
      this.addExpenseErrMessage = 'category is required';
      return;
    }
    if (!date) {
      this.addExpenseErrMessage = 'category is required';
      return;
    }
    if (!paidBy) {
      this.addExpenseErrMessage = 'category is required';
      return;
    }
    this.addExpenseLoading = true;
    this.budgetManagementService
      .addExpense(this.trip?._id!, this.addExpenseForm.value)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.addExpenseErrMessage = '';
          this.addExpenseLoading = false;
          this.store.dispatch(
            tripEditActions.updateBudget({ budget: res.budget }),
          );
          this.totalAmount += amount;
          this.closeAddExpenseModal();
        },
        error: (errMessage) => {
          this.addExpenseErrMessage = errMessage;
          this.addExpenseLoading = false;
        },
      });
  }
  deleteExpense(expenseId: string) {
    this.budgetManagementService
      .deleteExpense(this.trip?._id!, expenseId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updateBudget({ budget: res.budget }),
          );
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
  }
  showSetBudgetModal() {
    this.setBudgetForm.reset();
    this.setBudgetErrorMessage = '';
    const setBudgetModal = document.getElementById(
      'setBudgetModal',
    ) as HTMLDialogElement;
    setBudgetModal.showModal();
  }
  closeSetBudgetModal() {
    this.setBudgetErrorMessage = '';
    const setBudgetModal = document.getElementById(
      'setBudgetModal',
    ) as HTMLDialogElement;
    setBudgetModal.close();
  }
  submitSetBudgetForm() {
    const { amount } = this.setBudgetForm.value;
    if (amount.toString().trim().length <= 0) {
      this.addExpenseErrMessage = 'amount is required';
      return;
    }
    this.setBudgetLoading = true;
    this.budgetManagementService
      .setBudget(this.trip?._id!, this.setBudgetForm.value)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.setBudgetErrorMessage = '';
          this.setBudgetLoading = false;
          this.store.dispatch(
            tripEditActions.updateBudget({ budget: res.budget }),
          );
          this.closeSetBudgetModal();
        },
        error: (errMessage) => {
          this.setBudgetErrorMessage = errMessage;
          this.setBudgetLoading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
