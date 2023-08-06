import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  NgModel,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserAuthService } from 'src/app/services/user/user-auth.service';
import * as UserActions from '../../../../store/user/user.actions';

@Component({
  selector: 'app-signup-otp',
  templateUrl: './signup-otp.component.html',
  styleUrls: ['./signup-otp.component.scss'],
})
export class SignupOtpComponent {
  errMessage: string | null = null;
  loading: boolean = false;
  resendLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userAuthService: UserAuthService,
    private store: Store,
  ) {}

  onSubmit(form: NgForm): void {
    this.loading = true;
    this.userAuthService.emailVerify(form.value).subscribe({
      next: (res: any) => {
        this.errMessage = null;
        this.loading = false;
        this.store.dispatch(UserActions.userLogin({ user: res.user }));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errMessage = err.error.message;
        this.loading = false;
      },
    });
  }
  resendOtp() {
    this.resendLoading = true;
    this.userAuthService.resendOtp().subscribe({
      next: (res) => {
        this.errMessage = null;
        this.resendLoading = false;
      },
      error: (err) => {
        this.errMessage = err.error.message;
        this.resendLoading = false;
      },
    });
  }
}
