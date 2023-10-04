import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ShortTripInfo } from 'src/app/interfaces/short-trip.interface';
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
  userTrips: Array<ShortTripInfo> = [];
  loading = false;
  loadingMore = false;
  page = 0;
  lastPage = 0;
  editLoading = false;

  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getAllTrips()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.userTrips = res.trips;
          this.loading = false;
          this.page = res.page;
          this.lastPage = res.lastPage;
        },
        error: (errMessage: string) => {
          this.loading = false;
        },
      });
  }
  loadMoreTrips() {
    if (!this.loadingMore) {
      this.loadingMore = true;
      const page = this.page + 1;
      const params = new HttpParams().set('page', page);
      this.userService
        .getAllTrips(params)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.userTrips.push(...res.trips);
            this.loadingMore = false;
            this.page = res.page;
            this.lastPage = res.lastPage;
          },
          error: (errMessage: string) => {
            console.log(errMessage);
            this.loadingMore = false;
          },
        });
    }
  }
  navigateTo(id: string) {
    this.editLoading=true
    this.router.navigate(['trip/edit', id]);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
