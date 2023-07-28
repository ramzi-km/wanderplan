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
import { UserAuthService } from 'src/app/services/user-auth.service';

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
  ) {}

  onSubmit(form: NgForm): void {
    this.loading = true;
    this.userAuthService.emailVerify(form.value).subscribe({
      next: (res) => {
        this.errMessage = null;
        this.loading = false;
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
