import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { noSpace } from 'src/app/validators/noSpace.validators';
import * as UserActions from '../../../store/user/user.actions';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  signupForm!: FormGroup;
  errMessage: string | null = null;
  loading: boolean = false;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private userAuthService: UserAuthService,
    private socialAuthService: SocialAuthService,
    private store: Store,
  ) {
    this.signupForm = fb.group(
      {
        fullName: ['', [Validators.required, this.noEmptySpacesValidator()]],
        email: ['', [Validators.required, Validators.email]],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(5),
            noSpace.noSpaceValidation,
          ],
        ],
        mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: [
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
        validator: this.matchingPasswords('password', 'confirmPassword'),
      },
    );
  }
  get fc() {
    return this.signupForm.controls;
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

  submitForm() {
    this.loading = true;
    this.userAuthService
      .userRegister(this.signupForm.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.errMessage = null;
          this.loading = false;
          this.router.navigate(['/emailVerification']);
        },
        error: (errMessage) => {
          this.errMessage = errMessage;
          this.loading = false;
        },
      });
  }
  ngOnInit(): void {
    this.socialAuthService.authState
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((res: SocialUser) => {
          if (res?.idToken) {
            this.loading = true;
            return this.userAuthService.googleLogin({ token: res.idToken });
          } else {
            return EMPTY;
          }
        }),
      )
      .subscribe({
        next: (res) => {
          this.errMessage = null;
          this.loading = false;
          this.store.dispatch(UserActions.userLogin({ user: res.user }));
          this.router.navigate(['/home']);
        },
        error: (errMessage) => {
          this.errMessage = errMessage;
          this.loading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.socialAuthService.signOut();
  }
}
