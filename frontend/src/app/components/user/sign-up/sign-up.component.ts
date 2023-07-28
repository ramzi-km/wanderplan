import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  pass: string = '';
  conf:string = '';

  constructor(private router:Router) {
    this.signupForm = new FormGroup({
      fullName: new FormControl('', [
        Validators.required,
        this.noEmptySpacesValidator(),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        this.noEmptySpacesValidator(),
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
    this.router.navigate(['/emailVerification']);
  }
  ngOnInit(): void {}
}
