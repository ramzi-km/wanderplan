import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { environment } from 'environment';
import mapboxgl from 'mapbox-gl';
import { Subject, pipe, take, takeUntil } from 'rxjs';
import { TripService } from 'src/app/services/trip/trip.service';
import * as tripEditActions from '../../../store/editingTrip/trip-edit.actions';
import * as tripEditSelecctor from '../../../store/editingTrip/trip-edit.selectors';

@Component({
  selector: 'app-trip-edit',
  templateUrl: './trip-edit.component.html',
  styleUrls: ['./trip-edit.component.scss'],
})
export class TripEditComponent implements OnDestroy, OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('overview') overview!: ElementRef;
  @ViewChild('itinerary') itinerary!: ElementRef;
  @ViewChild('budget') budget!: ElementRef;

  coordinates!: [number, number];
  headingSaveBtn = false;
  headingLoading = false;
  tripName: string | undefined = '';
  nameInput = '';
  tripId = '';
  coverPhotoLoading = false;
  activeSection: string = 'overview';
  showOverview = true;
  private ngUnsubscribe = new Subject<void>();

  scrollToSection(section: ElementRef, sectionName: string): void {
    section.nativeElement.scrollIntoView({ behavior: 'smooth' });
    this.activeSection = sectionName;
  }

  constructor(
    private store: Store,
    private tripService: TripService,
  ) {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
    this.trip$.pipe(take(1)).subscribe({
      next: (trip) => {
        this.coordinates = trip.place?.coordinates!;
      },
    });
  }
  ngOnInit() {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.coordinates,
      zoom: 9,
    });
    this.trip$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (trip) => {
        this.coordinates = trip.place?.coordinates!;
        this.tripName = trip.name;
        this.nameInput = trip.name!;
        this.tripId = trip._id!;
        trip.overview?.placesToVisit.forEach((element) => {
          new mapboxgl.Marker({
            color: '#3FB1CE',
          })
            .setLngLat(element.coordinates!)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h1 class="text-lg">${element.name}</h1>
                <p class="text-sm">${element.description}</p>`,
              ),
            )
            .addTo(map);
        });
      },
    });
  }
  trip$ = this.store.select(tripEditSelecctor.selectEditingTrip);
  isDrawerOpen(): boolean {
    return this.drawer?.opened || false;
  }
  onHeadingFocus() {
    this.headingSaveBtn = true;
  }
  onHeadingBlur() {
    setTimeout(() => {
      this.headingSaveBtn = false;
      this.nameInput = this.tripName!;
    }, 300);
  }
  saveHeading() {
    this.headingLoading = true;
    if (this.nameInput?.trim().length > 3 && this.nameInput !== this.tripName) {
      this.tripService
        .changeName(this.tripId, { tripName: this.nameInput })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateTripName({ name: res.tripName }),
            );
            this.headingLoading = false;
          },
          error: (errMessage: string) => {
            this.headingLoading = false;
          },
        });
    } else {
      this.headingLoading = false;
      this.nameInput = this.tripName!;
    }
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.changeCoverPhoto(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  changeCoverPhoto(base64String: string): void {
    this.coverPhotoLoading = true;
    this.tripService
      .changeCoverphoto(this.tripId, { coverPhoto: base64String })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updateCoverPhoto({ coverPhoto: res.coverPhoto }),
          );
          this.coverPhotoLoading = false;
        },
        error: (errMessage: string) => {
          this.coverPhotoLoading = false;
        },
      });
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
