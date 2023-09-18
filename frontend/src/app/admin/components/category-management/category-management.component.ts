import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Category } from 'src/app/interfaces/category.interface';
import { CategoryManagementService } from '../../services/category-management.service';

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent implements OnInit, OnDestroy {
  constructor(
    fb: FormBuilder,
    private categoryManagementService: CategoryManagementService,
  ) {
    this.addCategoryForm = fb.group({
      categoryName: ['', [Validators.required, this.customMinLength(3)]],
      categoryIcon: ['', [Validators.required, this.customMinLength(4)]],
    });
    this.editCategoryForm = fb.group({
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
  get editCategoryFc() {
    return this.editCategoryForm.controls;
  }
  ngOnInit(): void {
    this.loading = true;
    this.categoryManagementService
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
  editCategoryForm: FormGroup;
  addCategoryErrMessage = '';
  searchText = '';
  categories: Category[] = [];
  loading = false;
  addCategoryLoading = false;
  editCategoryLoading = false;
  editCategoryErrMessage = '';
  editingCategory!: Category;
  unlistCategoryLoading = {
    value: false,
    id: '',
  };

  showAddCategoryModal() {
    this.addCategoryErrMessage = '';
    this.addCategoryForm.reset();
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
    this.categoryManagementService
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
  showEditCategoryModal(category: Category) {
    this.addCategoryErrMessage = '';
    this.editingCategory = category;
    this.editCategoryForm.setValue({
      categoryName: category.name,
      categoryIcon: category.icon,
    });
    const editCategoryModal = document.getElementById(
      'editCategoryModal',
    ) as HTMLDialogElement;
    editCategoryModal.showModal();
  }
  closeEditCategoryModal() {
    const editCategoryModal = document.getElementById(
      'editCategoryModal',
    ) as HTMLDialogElement;
    editCategoryModal.close();
  }
  submitEditCategoryForm() {
    const newCategory = this.editCategoryForm.value;
    const editingCategory = this.editingCategory;
    if (
      newCategory.categoryName !== editingCategory.name ||
      newCategory.categoryIcon !== editingCategory.icon
    ) {
      this.editCategoryLoading = true;
      this.categoryManagementService
        .editCategory(editingCategory._id, this.editCategoryForm.value)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.editCategoryErrMessage = '';
            this.editCategoryLoading = false;
            this.categories = this.categories.map((category) => {
              if (category._id == res.category._id) {
                return res.category;
              } else {
                return category;
              }
            });
            this.closeEditCategoryModal();
          },
          error: (errMessage) => {
            this.editCategoryErrMessage = errMessage;
            this.editCategoryLoading = false;
          },
        });
    } else {
      this.closeEditCategoryModal();
    }
  }
  toggleUnlistCategory(categoryId: string) {
    this.unlistCategoryLoading = {
      value: true,
      id: categoryId,
    };
    this.categoryManagementService
      .toggleUnlistCategory(categoryId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.categories = this.categories.map((category) => {
            if (category._id == res.category._id) {
              return res.category;
            } else {
              return category;
            }
          });
          this.unlistCategoryLoading = {
            value: false,
            id: '',
          };
        },
        error: (errMessage) => {
          this.unlistCategoryLoading = {
            value: false,
            id: '',
          };
          console.log(errMessage);
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
