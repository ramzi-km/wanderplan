import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AdminAuthService } from 'src/app/services/admin/admin-auth.service';
import * as AdminActions from '../../../store/admin/admin.actions';
import { noSpace } from '../../../validators/noSpace.validators';

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
      next: (res: any) => {
        this.errMessage = null;
        this.loading = false;
        this.store.dispatch(AdminActions.adminLogin({ admin: res.admin }));
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.errMessage = err.error.message;
        this.loading = false;
      },
    });
  }
}
