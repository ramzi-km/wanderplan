import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { noSpace } from 'src/app/validators/noSpace.validators';
import * as UserActions from '../../store/user/user.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  emailForm: FormGroup;
  loginForm: FormGroup;
  otpForm: FormGroup;
  errMessage: string | null = null;
  loading: boolean = false;
  emailSubmitLoading: boolean = false;
  emailErrMessage: string | null = null;
  otpSubmitLoading: boolean = false;
  otpErrMessage: string | null = null;
  emailSent = false;
  passHide = true;

  constructor(
    fb: FormBuilder,
    private store: Store,
    private userAuthService: UserAuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
  ) {
    this.loginForm = fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          noSpace.noSpaceValidation,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          noSpace.noSpaceValidation,
        ],
      ],
    });
    this.emailForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.otpForm = fb.group({
      otp: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          Validators.pattern('[0-9]*'),
        ],
      ],
    });
  }
  ngOnInit(): void {
    this.socialAuthService.signOut();
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
  get fc() {
    return this.loginForm.controls;
  }
  get emailFc() {
    return this.emailForm.controls;
  }
  get otpFc() {
    return this.otpForm.controls;
  }
  submitForm() {
    this.loading = true;
    this.userAuthService.userLogin(this.loginForm.value).subscribe({
      next: (res) => {
        this.errMessage = null;
        this.loading = false;
        this.store.dispatch(UserActions.userLogin({ user: res.user }));
        this.router.navigate(['/home']);
      },
      error: (errMessage: string) => {
        this.errMessage = errMessage;
        this.loading = false;
      },
    });
  }
  showEmailModal() {
    if (this.emailSent) {
      this.showOtpModal();
    } else {
      const inputEmailModal = document.getElementById(
        'inputEmailModal',
      ) as HTMLDialogElement;
      inputEmailModal.showModal();
    }
  }
  closeEmailModal() {
    const inputEmailModal = document.getElementById(
      'inputEmailModal',
    ) as HTMLDialogElement;
    inputEmailModal.close();
  }
  submitEmail() {
    this.emailSubmitLoading = true;
    this.userAuthService.forgotPassword(this.emailForm.value).subscribe({
      next: (res) => {
        console.log(res.message);
        this.emailSubmitLoading = false;
        this.emailSent = true;
        this.closeEmailModal();
        this.showOtpModal();
      },
      error: (errMessage: string) => {
        this.emailErrMessage = errMessage;
        this.emailSubmitLoading = false;
      },
    });
  }
  showOtpModal() {
    const otpModal = document.getElementById('otpModal') as HTMLDialogElement;
    otpModal.showModal();
  }
  closeOtpModal() {
    const otpModal = document.getElementById('otpModal') as HTMLDialogElement;
    otpModal.close();
  }
  submitOtp() {
    this.otpSubmitLoading = true;
    this.userAuthService.forgotPasswordVerify(this.otpForm.value).subscribe({
      next: (res) => {
        this.otpSubmitLoading = false;
        this.closeOtpModal();
        this.router.navigate(['/resetForgotPassword']);
      },
      error: (errMessage: string) => {
        this.otpErrMessage = errMessage;
        this.otpSubmitLoading = false;
      },
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
