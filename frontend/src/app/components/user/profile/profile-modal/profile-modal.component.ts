import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user.model';
import { UserService } from 'src/app/services/user/user.service';
import * as userActions from 'src/app/store/user/user.actions';
import * as userSelectors from 'src/app/store/user/user.selectors';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
})
export class ProfileModalComponent implements OnDestroy {
  profileForm: any;
  errMessage: string | null = null;
  loading: boolean = false;
  user!: User;
  user$!: Subscription;
  constructor(
    private matDialog: MatDialog,
    private store: Store,
    fb: FormBuilder,
    private userService: UserService,
  ) {
    this.user$ = this.store.select(userSelectors.selectUser).subscribe({
      next: (user) => {
        this.user = user;
      },
    });
    this.profileForm = fb.group({
      name: [
        this.user.name,
        [
          Validators.required,
          Validators.minLength(5),
          this.noEmptySpacesValidator(),
        ],
      ],
      username: [
        this.user.username,
        [
          Validators.required,
          Validators.minLength(5),
          noSpace.noSpaceValidation,
        ],
      ],
      mobile: [
        this.user.mobile,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/^\d{10}$/),
        ],
      ],
    });
  }
  get fc() {
    return this.profileForm.controls;
  }
  noEmptySpacesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value.trim().length < 5) {
        return { noEmptySpaces: true };
      }
      return null;
    };
  }
  submitForm() {
    let submit = true;
    if (
      this.profileForm.value.name == this.user.name &&
      this.profileForm.value.mobile == this.user.mobile &&
      this.profileForm.value.username == this.user.username
    ) {
      submit = false;
    }
    if (this.profileForm.valid && submit) {
      this.loading = true;
      this.userService.updateUser(this.profileForm.value).subscribe({
        next: (res: any) => {
          this.store.dispatch(userActions.getUserSuccess({ user: res.user }));
          this.loading = false;
          this.closeDialog();
        },
        error: (error) => {
          console.log(error);
          this.errMessage = error.error.message;
          this.loading = false;
        },
      });
    } else {
      this.closeDialog();
    }
  }
  closeDialog() {
    this.matDialog.closeAll();
  }
  ngOnDestroy(): void {
    this.user$.unsubscribe();
  }
}
