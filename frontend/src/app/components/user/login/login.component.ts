import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import { noSpace } from 'src/app/validators/noSpace.validators';
import * as UserActions from '../../../store/user/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: any;
  errMessage: string | null = null;
  loading: boolean = false;
  constructor(
    fb: FormBuilder,
    private store: Store,
    private userAuthService: UserAuthService,
    private router: Router,
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
  }
  get fc() {
    return this.loginForm.controls;
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
}
