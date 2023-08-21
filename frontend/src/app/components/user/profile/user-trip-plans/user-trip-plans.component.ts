import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
  ) {}
  private ngUnsubscribe = new Subject<void>();
  userTrips: Array<any> = [];
  ngOnInit(): void {
    this.userService
      .getAllTrips()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.userTrips = res.trips;
        },
        error: (errMessage:string) => {
          // this.showToast(errMessage);
        },
      });
  }
  showToast(message: string) {
    this.toastr.error(message, 'Error!', {
      timeOut: 3000,
    });
  }
  navigateTo(id: string) {
    this.router.navigate(['trip/edit', id]);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
