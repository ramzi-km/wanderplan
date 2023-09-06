import { Component, ElementRef, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MapboxPlaceFeature } from 'src/app/interfaces/mapbox-interface';
import { Trip } from 'src/app/interfaces/trip.interface';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent {
  @Input() trip: Trip | undefined;
  constructor(
    private elementRef: ElementRef,
    private mapboxService: MapboxService,
  ) {}
  scrollToSection(sectionId: string) {
    const sectionElement = this.elementRef.nativeElement.querySelector(
      `.section-${sectionId}`,
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private ngUnsubscribe$ = new Subject<void>();
  inputControl = new FormControl();
  showResults = false;
  showResultsIndex!: number;
  places: Array<MapboxPlaceFeature> = [];
  addPlaceLoading = {
    value: false,
    index: 0,
  };
  subheadingSaving = {
    value: false,
    index: 0,
  };

  ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((location: string) => {
          // Cancel previous request and start a new one
          return this.mapboxService.getLocationData(location);
        }),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((response) => {
        this.places = response.features;
      });
  }

  saveSubheading(oldValue: string, newValue: string, itineraryIndex: number) {
    if (newValue !== oldValue) {
      
    }
  }

  onFocus(index: number) {
    this.showResultsIndex = index;
    this.showResults = true;
  }
  blurResults() {
    setTimeout(() => {
      this.inputControl.setValue('');
      this.showResults = false;
    }, 200);
  }
  selectPlace(selectedPlace: any, itineraryIndex: number) {
    this.inputControl.setValue('');
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
    };
    this.addPlaceLoading = { value: true, index: itineraryIndex };
    //   this.tripService
    //     .addPlaceToVisit(this.trip?._id!, { place: place })
    //     .pipe(takeUntil(this.ngUnsubscribe$))
    //     .subscribe({
    //       next: (res) => {
    //         this.store.dispatch(
    //           tripEditActions.addPlaceToVisit({ place: res.place }),
    //         );
    //         this.addPlaceToVisitLoading = false;
    //       },
    //       error: (errMessage) => {
    //         console.log(errMessage);
    //         this.addPlaceToVisitLoading = false;
    //       },
    //     });
  }
  selectedPlaceIndex: number = -1;
  onKeyDown(event: KeyboardEvent, itineraryIndex: number) {
    if (event.key === 'ArrowDown') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex + 1) % this.places.length;
    } else if (event.key === 'ArrowUp') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex - 1 + this.places.length) % this.places.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedPlaceIndex >= 0) {
        this.selectPlace(this.places[this.selectedPlaceIndex], itineraryIndex);
        this.selectedPlaceIndex = -1;
      }
      (event.target as HTMLInputElement).blur();
    }
  }
}
