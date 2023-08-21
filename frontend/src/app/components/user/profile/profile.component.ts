import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user/user.service';
import * as userActions from 'src/app/store/user/user.actions';
import * as userSelectors from '../../../store/user/user.selectors';

import { Subject, Subscription, takeUntil } from 'rxjs';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  user$ = this.store.select(userSelectors.selectUser);
  private ngUnsubscribe = new Subject<void>();
  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private userService: UserService,
    private toastr: ToastrService,
  ) {}
  ngOnInit(): void {}

  openDialog() {
    this.matDialog.open(ProfileModalComponent, {
      width: '350px',
    });
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.uploadProfilePicture(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(base64String: string): void {
    this.loading = true;
    const formData = { profilePic: base64String };
    this.userService
      .uploadProfile(formData)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(userActions.getUserSuccess({ user: res.user }));
          this.loading = false;
        },
        error: (errMessage:string) => {
          this.loading = false;
        },
      });
  }
  showToast(message: string) {
    this.toastr.error(message, 'Error!', {
      timeOut: 3000,
    });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
