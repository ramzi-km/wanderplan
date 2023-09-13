import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { Category } from 'src/app/interfaces/category.interface';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.addCategoryForm = fb.group({
      categoryName: ['', [Validators.required, this.customMinLength(3)]],
      categoryIcon: ['', [Validators.required, this.customMinLength(4)]],
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
  get fc() {
    return this.addCategoryForm.controls;
  }
  ngOnInit(): void {
    this.loading = true;
    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.categories = res.categories;
        },
        error: (errMessage) => {
          this.loading = false;
        },
      });
  }

  private ngUnsubscribe$ = new Subject<void>();
  addCategoryForm: FormGroup;
  addCategoryErrMessage = '';
  searchText = '';
  categories: Category[] = [];
  loading = false;
  addCategoryLoading = false;
  showAddCategoryModal() {
    const addCategoryModal = document.getElementById(
      'addCategoryModal',
    ) as HTMLDialogElement;
    addCategoryModal.showModal();
  }
  closeAddCategoryModal() {
    const addCategoryModal = document.getElementById(
      'addCategoryModal',
    ) as HTMLDialogElement;
    addCategoryModal.close();
  }
  submitAddCategoryForm() {
    this.addCategoryLoading = true;
    this.categoryService
      .addCategory(this.addCategoryForm.value)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.addCategoryErrMessage = '';
          this.addCategoryLoading = false;
          this.categories.push(res.category);
          this.closeAddCategoryModal();
        },
        error: (errMessage) => {
          this.addCategoryErrMessage = errMessage;
          this.addCategoryLoading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
