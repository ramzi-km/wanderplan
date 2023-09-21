import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import * as userActions from 'src/app/store/user/user.actions';
import { noSpace } from 'src/app/validators/noSpace.validators';
import * as userSelectors from '../../../store/user/user.selectors';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy, OnInit {
  loading: boolean = false;
  resetPassForm: FormGroup;
  resetPassLoading = false;
  resetPassErrMessage = '';
  user$ = this.store.select(userSelectors.selectUser);
  private ngUnsubscribe = new Subject<void>();
  constructor(
    fb: FormBuilder,
    private store: Store,
    private matDialog: MatDialog,
    private userService: UserService,
    private router: Router,
  ) {
    this.resetPassForm = fb.group(
      {
        currentPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            noSpace.noSpaceValidation,
            Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z])/),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            noSpace.noSpaceValidation,
            Validators.pattern(/^(?=.*\d)(?=.*[a-zA-Z])/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: this.matchingPasswords('newPassword', 'confirmPassword'),
      },
    );
  }
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      const passwordControl = group.controls[passwordKey];
      const confirmPasswordControl = group.controls[confirmPasswordKey];

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mismatchedPasswords: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
  get fc() {
    return this.resetPassForm.controls;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const currentPosition = window.scrollY;
          setTimeout(() => {
            window.scrollTo(0, currentPosition);
          }, 200);
        }
      });
  }
  openDialog() {
    this.matDialog.open(ProfileModalComponent, {
      width: '350px',
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.uploadProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(base64String: string): void {
    this.loading = true;
    const formData = { profilePic: base64String };
    this.userService
      .uploadProfile(formData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(userActions.getUserSuccess({ user: res.user }));
          this.loading = false;
        },
        error: (errMessage: string) => {
          this.loading = false;
        },
      });
  }
  showResetPassModal() {
    const resetPassModal = document.getElementById(
      'resetPassModal',
    ) as HTMLDialogElement;
    resetPassModal.showModal();
  }
  closeResetPassModal() {
    const resetPassModal = document.getElementById(
      'resetPassModal',
    ) as HTMLDialogElement;
    resetPassModal.close();
    this.resetPassForm.markAsUntouched();
  }
  submitResetPassForm() {
    this.resetPassLoading = true;
    this.userService.resetPassword(this.resetPassForm.value).subscribe({
      next: (res) => {
        this.resetPassErrMessage = '';
        this.resetPassLoading = false;
        this.closeResetPassModal();
        this.resetPassForm.setValue({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        this.resetPassForm.markAsUntouched();
      },
      error: (errMessage: string) => {
        this.resetPassErrMessage = errMessage;
        this.resetPassLoading = false;
      },
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
