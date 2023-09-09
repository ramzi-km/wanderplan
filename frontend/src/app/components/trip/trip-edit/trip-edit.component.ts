import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { environment } from 'environment';
import mapboxgl from 'mapbox-gl';
import { Subject, pipe, take, takeUntil } from 'rxjs';
import {
  ItineraryPlace,
  PlaceToVisit,
  Trip,
} from 'src/app/interfaces/trip.interface';
import { TripService } from 'src/app/services/trip/trip.service';
import * as tripEditActions from '../../../store/editingTrip/trip-edit.actions';
import * as tripEditSelecctor from '../../../store/editingTrip/trip-edit.selectors';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { OverviewComponent } from './overview/overview.component';

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
  @ViewChild(OverviewComponent) appOverview!: OverviewComponent;
  @ViewChild(ItineraryComponent) appItinerary!: ItineraryComponent;
  scrollToOverviewSections(sectionId: string) {
    this.appOverview.scrollToSection(sectionId);
  }
  scrollToDynamicSection(sectionId: string) {
    this.appItinerary.scrollToSection(sectionId);
  }
  map!: mapboxgl.Map;
  markers: mapboxgl.Marker[] = [];
  markers2: mapboxgl.Marker[] = [];
  currentMarker!: mapboxgl.Marker;
  trip!: Trip;
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
    private renderer: Renderer2,
    private el: ElementRef,
  ) {
    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
    this.trip$.pipe(take(1)).subscribe({
      next: (trip) => {
        this.trip = trip;
      },
    });
  }

  ngOnInit() {
    // this.map = new mapboxgl.Map({
    //   container: 'map',
    //   style: 'mapbox://styles/mapbox/streets-v12',
    //   center: this.trip.place?.coordinates,
    //   zoom: 9,
    // });
    this.trip$.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (trip) => {
        this.trip = trip;
        this.tripName = trip.name;
        this.nameInput = trip.name!;
        this.tripId = trip._id!;
        this.markers.forEach((marker) => marker.remove());
        this.markers2.forEach((marker) => marker.remove());
        this.markers = [];
        this.markers2 = [];
        trip.overview?.placesToVisit.forEach((element, i) => {
          const divElement = this.renderer.createElement('div');
          this.renderer.addClass(divElement, 'marker');
          const spanElement = this.renderer.createElement('span');
          const bElement = this.renderer.createElement('b');
          const text = this.renderer.createText('' + (i + 1));
          this.renderer.appendChild(bElement, text);
          this.renderer.appendChild(spanElement, bElement);
          this.renderer.appendChild(divElement, spanElement);
          this.renderer.appendChild(this.el.nativeElement, divElement);
          const marker = new mapboxgl.Marker(divElement)
            .setLngLat(element.coordinates!)
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<h1 class="text-lg font-bold">${element.name}</h1><br>
                <div class="flex flex-col space-y-2"><img class="h-24 w-full rounded-lg object-cover"
                src="${element.image}"><p class="text-sm">${element.description}</p>
                
                </div>
                `,
              ),
            )
            .addTo(this.map);
          this.markers.push(marker);
        });
        trip.itinerary?.forEach((element, i) => {
          element.places?.forEach((place, placeI) => {
            const divElement = this.renderer.createElement('div');
            this.renderer.addClass(divElement, 'marker2');
            const spanElement = this.renderer.createElement('span');
            const bElement = this.renderer.createElement('b');
            const text = this.renderer.createText(`${i + 1}.${placeI + 1}`);
            this.renderer.appendChild(bElement, text);
            this.renderer.appendChild(spanElement, bElement);
            this.renderer.appendChild(divElement, spanElement);
            this.renderer.appendChild(this.el.nativeElement, divElement);
            const marker = new mapboxgl.Marker(divElement)
              .setLngLat(place.coordinates!)
              .setPopup(
                new mapboxgl.Popup().setHTML(
                  `<h1 class="text-lg font-bold">${place.name}</h1><br>
                  <div class="flex flex-col space-y-2"><img class="h-24 w-full rounded-lg object-cover"
                  src="${place.image}"><p class="text-sm">${place.description}</p>
                  
                  </div>
                  `,
                ),
              )
              .addTo(this.map);
            this.markers2.push(marker);
          });
        });
      },
    });
  }
  trip$ = this.store.select(tripEditSelecctor.selectEditingTrip);
  isDrawerOpen(): boolean {
    return this.drawer?.opened || false;
  }
  onHeadingBlur() {
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
  onAccordionClicked(place: PlaceToVisit) {
    this.map.flyTo({ center: place.coordinates, zoom: 13 });
    this.togglePopupByIndex(place.index!);
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
  onAccordionClicked2(place: ItineraryPlace) {
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
    this.togglePopupByIndex2(count);
  }
  togglePopupByIndex2(index: number) {
    if (this.currentMarker) {
      const popup = this.currentMarker!.getPopup();
      if (popup.isOpen()) {
        this.currentMarker!.togglePopup();
      }
    }
    if (index >= 0 && index < this.markers2.length) {
      const popup = this.markers2[index].getPopup();
      if (!popup.isOpen()) {
        this.markers2[index].togglePopup();
      }
      this.currentMarker = this.markers2[index];
    }
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
