import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subject, of, switchMap, takeUntil } from 'rxjs';
import { TripService } from 'src/app/services/trip/trip.service';
import { UserService } from 'src/app/services/user/user.service';
import * as tripEditActions from '../../../store/editingTrip/trip-edit.actions';
import * as tripEditSelector from '../../../store/editingTrip/trip-edit.selectors';
import * as UserActions from '../../../store/user/user.actions';
import * as UserSelector from '../../../store/user/user.selectors';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private store: Store,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private tripService: TripService,
  ) {}
  private ngUnsubscribe = new Subject<void>();
  user$ = this.store.select(UserSelector.selectUser);
  isLoggedIn$ = this.store.select(UserSelector.selectIsLoggedIn);
  recentTrips: Array<any> = [];
  upcomingTrips: Array<any> = [];
  ngOnInit(): void {
    this.userService
      .getRecentTrips()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any) => {
          this.recentTrips = res.recentTrips;
          this.upcomingTrips = res.upcomingTrips;
        },
        error: (err: any) => {
          this.showToast(err.error.message);
        },
      });

    const swiperEl: any = document.querySelector('.mySwiper');
    Object.assign(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 10,
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 50,
        },
      },
    });
    swiperEl?.initialize();
  }
  navigateTo(id: string) {
    this.tripService
      .getDetails(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res: any) => {
        if (res.editable) {
          this.store.dispatch(tripEditActions.setTripEdit({ trip: res.trip }));
          this.router.navigate(['trip/edit', id]);
        }
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
