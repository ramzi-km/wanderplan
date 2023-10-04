import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDrawer, MatSidenavContainer } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import mapboxgl from 'mapbox-gl';
import { Subject, take, takeUntil } from 'rxjs';
import { ItineraryPlace, Place, Trip } from 'src/app/interfaces/trip.interface';
import { User } from 'src/app/interfaces/user.model';
import { TripService } from 'src/app/services/trip/trip.service';
import { environment } from 'src/environments/environment';
import * as userSelectors from '../../../store/user/user.selectors';

@Component({
  selector: 'app-trip-view',
  templateUrl: './trip-view.component.html',
  styleUrls: ['./trip-view.component.scss'],
})
export class TripViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('overview') overview!: ElementRef;
  @ViewChild(MatSidenavContainer) sidenavContainer!: MatSidenavContainer;

  scrollToSection(section: ElementRef): void {
    section.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
  scrollToDynamicSection(sectionI: string) {
    const sectionElement = this.elementRef.nativeElement.querySelector(
      `.section-${sectionI}`,
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  ngAfterViewInit() {
    this.setSidenavMode();
    window.addEventListener('resize', () => {
      this.setSidenavMode();
    });
  }

  private setSidenavMode() {
    if (window.innerWidth >= 1200) {
      this.drawer.mode = 'side';
    } else {
      this.drawer.mode = 'over';
    }
  }

  private ngUnsubscribe$ = new Subject<void>();
  trip!: Trip;
  tripId: string = '';
  loading = false;
  loadingTrip = false;
  tripmates: string[] = [];
  currentPosition = 0;
  showMap = false;
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  currentMarker!: mapboxgl.Marker;
  activePlace = '';
  user!: User;

  constructor(
    private tripService: TripService,
    private route: ActivatedRoute,
    private location: Location,
    private renderer: Renderer2,
    private router: Router,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    private store: Store,
  ) {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
  }

  ngOnInit(): void {
    this.store
      .select(userSelectors.selectUser)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.user = res;
        },
      });

    this.loading = true;
    this.loadingTrip = true;
    this.route.params.pipe(take(1)).subscribe((params) => {
      this.tripId = params['tripId'];
    });
    this.tripService
      .getViewTripDetails(this.tripId)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.trip = res.trip;
          this.loadingTrip = false;
          this.setSidenavMode();
          this.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: this.trip.place?.coordinates,
            zoom: 9,
          });
          this.markers.forEach((marker) => marker.remove());
          this.markers = [];
          this.trip.itinerary?.forEach((element, i) => {
            element.places?.forEach((place, placeI) => {
              const divElement = this.renderer.createElement('div');
              this.renderer.addClass(divElement, 'marker');
              const spanElement = this.renderer.createElement('span');
              const bElement = this.renderer.createElement('b');
              const text = this.renderer.createText(`${i + 1}.${placeI + 1}`);
              this.renderer.appendChild(bElement, text);
              this.renderer.appendChild(spanElement, bElement);
              this.renderer.appendChild(divElement, spanElement);
              this.renderer.appendChild(
                this.elementRef.nativeElement,
                divElement,
              );
              const marker = new mapboxgl.Marker(divElement)
                .setLngLat(place.coordinates!)
                .setPopup(
                  new mapboxgl.Popup().setHTML(
                    `<h1 class="text-lg font-bold">${place.name}</h1><br>
                    <div class="flex flex-col space-y-2"><img class="h-24 w-full rounded-lg object-cover"
                    src="${place.image}"><br>
                    <p class="line-clamp-3 break-words">${place.description}</p>
                    </div>
                    `,
                  ),
                )
                .addTo(this.map);
              this.markers.push(marker);
            });
          });
          this.tripmates = res.tripmates;
          this.loading = false;
        },
        error: (errMessage: string) => {
          this.loadingTrip = false;
          this.loading = false;
          this.location.back();
        },
      });
  }

  isDrawerOpen(): boolean {
    return this.drawer?.opened || false;
  }

  onPlaceClick(place: ItineraryPlace) {
    this.activePlace = place._id!;
    this.map.flyTo({ center: place.coordinates, zoom: 13 });
    let count = 0;
    let flag = false;
    for (const element of this.trip.itinerary || []) {
      for (const item of element.places || []) {
        if (place._id == item._id) {
          flag = true;
          break;
        } else {
          count++;
        }
      }
      if (flag) {
        break;
      }
    }
    this.togglePopupByIndex(count);
  }

  togglePopupByIndex(index: number) {
    if (this.currentMarker) {
      const popup = this.currentMarker!.getPopup();
      if (popup.isOpen()) {
        this.currentMarker!.togglePopup();
      }
    }
    if (index >= 0 && index < this.markers.length) {
      const popup = this.markers[index].getPopup();
      if (!popup.isOpen()) {
        this.markers[index].togglePopup();
      }
      this.currentMarker = this.markers[index];
    }
  }

  showMapFn() {
    this.currentPosition =
      this.sidenavContainer.scrollable.measureScrollOffset('top');
    this.showMap = true;
  }
  closeMap() {
    this.showMap = false;
    setTimeout(() => {
      this.sidenavContainer.scrollable.scrollTo({
        top: this.currentPosition,
        behavior: 'auto',
      });
    }, 100);
  }

  convertTextToTextWithLinks(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const replacedText = text.replace(urlRegex, (url) => {
      return `<a href="${url}" class="link text-blue-500 link-hover" target="_blank">${url}</a>`;
    });

    return replacedText;
  }

  likeOrUnlikeTrip() {
    if (this.user._id) {
      if (this.trip.likes?.includes(this.user._id)) {
        this.tripService
          .unlikeTrip(this.trip._id!)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              this.trip.likes = res.likes;
              this.trip.likesCount = res.likesCount;
            },
            error: (errMessage) => {
              console.log(errMessage);
            },
          });
      } else {
        this.tripService
          .likeTrip(this.trip._id!)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe({
            next: (res) => {
              this.trip.likes = res.likes;
              this.trip.likesCount = res.likesCount;
            },
            error: (errMessage) => {
              console.log(errMessage);
            },
          });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
