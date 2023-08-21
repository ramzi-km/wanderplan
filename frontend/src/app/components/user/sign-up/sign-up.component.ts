import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { noSpace } from 'src/app/validators/noSpace.validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  pass: string = '';
  conf: string = '';
  errMessage: string | null = null;
  loading: boolean = false;

  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private http: HttpClient,
  ) {
    this.signupForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        this.noEmptySpacesValidator(),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        noSpace.noSpaceValidation,
      ]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        this.passwordValidator(),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        this.confirmPasswordValidator(),
      ]),
    });
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
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (/\s/.test(value)) {
        return { containsSpaces: true };
      }
      if (!/(?=.*\d)(?=.*[a-zA-Z])/.test(value)) {
        return { invalidPassword: true };
      }

      return null;
    };
  }
  // Custom validator function to check if the "confirm password" matches the "password"
  confirmPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value !== this.pass) {
        return { mismatch: true };
      }
      return null;
    };
  }

  submitForm() {
    this.loading = true;
    this.userAuthService.userRegister(this.signupForm.value).subscribe({
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
  ngOnInit(): void {}
}
