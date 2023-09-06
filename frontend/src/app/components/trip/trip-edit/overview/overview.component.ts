import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
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
import { PlaceToVisit, Trip } from 'src/app/interfaces/trip.interface';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';
import { TripService } from 'src/app/services/trip/trip.service';
import * as tripEditActions from '../../../../store/editingTrip/trip-edit.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, OnDestroy {
  @Input() trip: Trip | undefined;
  @Output() accordionClicked: EventEmitter<any> = new EventEmitter<any>();

  changeImageLoading = false;
  addPlaceToVisitLoading = false;
  descriptionLoading = false;
  notesLoading = false;
  showResults: boolean = false;
  inputControl = new FormControl();
  places: Array<MapboxPlaceFeature> = [];
  imageLoadingindex!: number;
  private ngUnsubscribe$ = new Subject<void>();
  constructor(
    private tripService: TripService,
    private store: Store,
    private mapboxService: MapboxService,
    private elementRef: ElementRef,
  ) {}
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
  scrollToSection(sectionId: string) {
    const sectionElement = this.elementRef.nativeElement.querySelector(
      `.section-${sectionId}`,
    );
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  updateDescription(newValue: string) {
    if (newValue !== this.trip?.overview?.description) {
      this.descriptionLoading = true;
      this.tripService
        .updateDescription(this.trip?._id!, {
          description: newValue,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateDescription({
                description: res.tripDescription,
              }),
            );
            this.descriptionLoading = false;
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.descriptionLoading = false;
          },
        });
    }
  }
  updateNotes(newValue: string) {
    if (newValue !== this.trip?.overview?.notes) {
      this.notesLoading = true;
      this.tripService
        .updateNotes(this.trip?._id!, { notes: newValue })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateOverviewNotes({ notes: res.overviewNotes }),
            );
            this.notesLoading = false;
          },
          error: () => {
            this.notesLoading = false;
          },
        });
    }
  }

  blurResults() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }
  selectPlace(selectedPlace: any) {
    this.inputControl.setValue('');
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
    };
    this.addPlaceToVisitLoading = true;
    this.tripService
      .addPlaceToVisit(this.trip?._id!, { place: place })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.addPlaceToVisit({ place: res.place }),
          );
          this.addPlaceToVisitLoading = false;
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.addPlaceToVisitLoading = false;
        },
      });
  }
  selectedPlaceIndex: number = -1;
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex + 1) % this.places.length;
    } else if (event.key === 'ArrowUp') {
      this.selectedPlaceIndex =
        (this.selectedPlaceIndex - 1 + this.places.length) % this.places.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedPlaceIndex >= 0) {
        this.selectPlace(this.places[this.selectedPlaceIndex]);
        this.selectedPlaceIndex = -1;
      }
      (event.target as HTMLInputElement).blur();
    }
  }
  onPlacesToVisitClick(place: PlaceToVisit, index: number) {
    place = { ...place, index };
    this.accordionClicked.emit(place);
  }
  deletePlaceToVisit(placeIndex: number) {
    this.tripService.deletePlace(this.trip?._id!, placeIndex).subscribe({
      next: (res) => {
        this.store.dispatch(tripEditActions.deletePlaceToVisit({ placeIndex }));
      },
      error: (errMessage) => {
        console.log(errMessage);
      },
    });
  }
  onFileSelected(event: any, placeIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.changeImage(base64String, placeIndex);
      };
      reader.readAsDataURL(file);
    }
  }
  changeImage(base64String: string, placeIndex: number): void {
    this.changeImageLoading = true;
    this.imageLoadingindex = placeIndex;
    this.tripService
      .updatePlaceToVisitPhoto(this.trip?._id!, placeIndex, {
        image: base64String,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updatePlaceToVisit({
              placeIndex,
              place: res.place,
            }),
          );
          this.changeImageLoading = false;
        },
        error: (errMessage: string) => {
          this.changeImageLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
