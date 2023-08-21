import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { noSpace } from 'src/app/validators/noSpace.validators';
import { AdminAuthService } from '../../services/admin-auth.service';
import * as AdminActions from '../../store/admin/admin.actions';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  loginForm: any;
  errMessage: string | null = null;
  loading: boolean = false;
  constructor(
    fb: FormBuilder,
    private store: Store,
    private router: Router,
    private adminAuthService: AdminAuthService,
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
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
    this.adminAuthService.adminLogin(this.loginForm.value).subscribe({
      next: (res) => {
        this.errMessage = null;
        this.loading = false;
        this.store.dispatch(AdminActions.adminLogin({ admin: res.admin }));
        this.router.navigate(['/admen']);
      },
      error: (errMessage: string) => {
        this.errMessage = errMessage;
        this.loading = false;
      },
    });
  }
}
