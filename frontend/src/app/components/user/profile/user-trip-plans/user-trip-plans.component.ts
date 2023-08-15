import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-trip-plans',
  templateUrl: './user-trip-plans.component.html',
  styleUrls: ['./user-trip-plans.component.scss'],
})
export class UserTripPlansComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ) {}
  private ngUnsubscribe = new Subject<void>();
  userTrips: Array<any> = [];
  ngOnInit(): void {
    this.userService
      .getAllTrips()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.userTrips = res.trips;
        },
        error: (err: any) => {
          this.showToast(err.error.message);
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
