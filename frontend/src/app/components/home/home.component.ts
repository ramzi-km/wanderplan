import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ShortGuideInfo } from 'src/app/interfaces/short-guide.interface';
import { ShortTripInfo } from 'src/app/interfaces/short-trip.interface';
import { UserService } from 'src/app/services/user/user.service';

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
  ) {}
  private ngUnsubscribe = new Subject<void>();
  upcomingTrips: Array<ShortTripInfo> = [];
  userTrips: Array<ShortTripInfo> = [];
  userGuides: Array<ShortGuideInfo> = [];
  errMessage!: string;
  loading = false;
  ngOnInit(): void {
    this.loading = true;
    this.userService
      .getUpcomingTrips()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.upcomingTrips = res.upcomingTrips;
          this.loading = false;
        },
        error: (errMessage) => {
          this.errMessage = errMessage;
          this.loading = false;
        },
      });

    const swiperEl: any = document.querySelector('.mySwiper');
    Object.assign(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 10,
      breakpoints: {
        640: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          slidesPerGroup: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 4,
          slidesPerGroup: 2,
          spaceBetween: 50,
        },
      },
      navigation: true,
    });
    swiperEl?.initialize();

    this.userService
      .getAllTrips()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.userTrips = res.trips;
        },
        error: (errMessage: string) => {
          console.log(errMessage);
        },
      });

    this.userService
      .getAllGuides()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.userGuides = res.guides;
        },
        error: (errMessage: string) => {
          console.log(errMessage);
        },
      });
  }
  navigateTo(id: string) {
    this.router.navigate(['trip/edit', id]);
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
