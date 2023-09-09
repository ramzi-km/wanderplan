import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';
import { MapboxPlaceFeature } from 'src/app/interfaces/mapbox-interface';
import { ItineraryPlace, Trip } from 'src/app/interfaces/trip.interface';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';
import { ItineraryManagementService } from 'src/app/services/trip/itinerary-management.service';
import * as tripEditActions from '../../../../store/editingTrip/trip-edit.actions';

@Component({
  selector: 'app-itinerary',
  templateUrl: './itinerary.component.html',
  styleUrls: ['./itinerary.component.scss'],
})
export class ItineraryComponent {
  @Input() trip: Trip | undefined;
  @Output() accordionClicked: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private elementRef: ElementRef,
    private mapboxService: MapboxService,
    private itineraryManagementService: ItineraryManagementService,
    private store: Store,
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
    id: '',
  };
  subheadingSaving = {
    value: false,
    index: 0,
  };
  changeImageLoading = {
    value: false,
    id: '',
  };
  descriptionSaving = {
    value: false,
    id: '',
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

  saveSubheading(oldValue: string, newValue: string, dayIndex: number) {
    if (newValue !== oldValue) {
      this.subheadingSaving = { value: true, index: dayIndex };
      this.itineraryManagementService
        .updateSubheading(this.trip?._id!, dayIndex, {
          subheading: newValue,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateSubheading({
                subheading: res.subheading,
                dayIndex: dayIndex,
              }),
            );
            this.subheadingSaving = { value: false, index: dayIndex };
          },
          error: (error) => {
            console.log(error);
            this.subheadingSaving = { value: false, index: dayIndex };
          },
        });
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
  selectPlace(selectedPlace: any, dayId: string, dayIndex: number) {
    this.inputControl.setValue('');
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
    };
    this.addPlaceLoading = { value: true, id: dayId };
    this.itineraryManagementService
      .addPlace(this.trip?._id!, dayId, { place: place })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.store.dispatch(
            tripEditActions.addItineraryPlace({ place: res.place, dayIndex }),
          );
          this.addPlaceLoading = { value: false, id: dayId };
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.addPlaceLoading = { value: false, id: dayId };
        },
      });
  }
  selectedPlaceIndex: number = -1;
  onKeyDown(event: KeyboardEvent, dayId: string, dayIndex: number) {
    if (event.key === 'ArrowDown') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex + 1) % this.places.length;
    } else if (event.key === 'ArrowUp') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex - 1 + this.places.length) % this.places.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedPlaceIndex >= 0) {
        this.selectPlace(this.places[this.selectedPlaceIndex], dayId, dayIndex);
        this.selectedPlaceIndex = -1;
      }
      (event.target as HTMLInputElement).blur();
    }
  }
  onPlaceClick(place: ItineraryPlace) {
    place = { ...place };
    this.accordionClicked.emit(place);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
