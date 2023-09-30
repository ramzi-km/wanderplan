import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShortGuideInfo } from 'src/app/interfaces/short-guide.interface';
import { Place } from 'src/app/interfaces/trip.interface';
import { ListGuidesService } from 'src/app/services/listGuides/list-guides.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  @Input() place: Place | undefined;

  constructor(private listGuidesService: ListGuidesService) {}
  private ngUnsubscribe$ = new Subject<void>();
  errMessage!: string;
  loading = false;
  guides: ShortGuideInfo[] = [];
  ngOnInit(): void {
    const params = new HttpParams()
      .set('page', 0)
      .set('searchText', this.place?.name!);

    this.loading = true;
    this.listGuidesService
      .getAllGuidesAndItineraries(params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.guides = res.guides ?? [];
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.loading = false;
        },
      });

    const swiperEl: any = document.querySelector('.mySwiper2');
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
          slidesPerView: 3,
          slidesPerGroup: 2,
          spaceBetween: 50,
        },
      },
      navigation: true,
    });
    swiperEl?.initialize();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
