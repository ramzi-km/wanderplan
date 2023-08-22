import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-reset-forgot-password',
  templateUrl: './reset-forgot-password.component.html',
  styleUrls: ['./reset-forgot-password.component.scss'],
})
export class ResetForgotPasswordComponent {
  loading = false;
  resetPassForm: FormGroup;
  errMessage: string = '';
  constructor(
    fb: FormBuilder,
    private userAuthService: UserAuthService,
    private router: Router,
  ) {
    this.resetPassForm = fb.group(
      {
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

  submitForm() {
    this.loading = true;
    this.userAuthService
      .resetForgotPassword(this.resetPassForm.value)
      .subscribe({
        next: (res) => {
          this.errMessage = '';
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (errMessage: string) => {
          this.errMessage = errMessage;
          this.loading = false;
        },
      });
  }
}
