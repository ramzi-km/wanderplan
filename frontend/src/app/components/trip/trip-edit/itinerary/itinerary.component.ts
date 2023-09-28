import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
    fb: FormBuilder,
    private elementRef: ElementRef,
    private mapboxService: MapboxService,
    private itineraryManagementService: ItineraryManagementService,
    private store: Store,
  ) {
    this.addTimeForm = fb.group({
      startTime: ['start time', [Validators.required]],
      endTime: ['end time', [Validators.required]],
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

  private ngUnsubscribe$ = new Subject<void>();
  inputControl = new FormControl();
  showResults = false;
  showResultsIndex!: number;
  places: Array<MapboxPlaceFeature> = [];
  deletePlaceLoading = false;
  deletePlaceIndex = {
    dayIndex: 0,
    placeIndex: 0,
  };
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
    dayIndex: 0,
    placeIndex: 0,
  };
  descriptionSaving = {
    value: false,
    dayIndex: 0,
    placeIndex: 0,
  };
  notesSaving = {
    value: false,
    dayIndex: 0,
    placeIndex: 0,
  };
  addTimeForm: FormGroup;
  addTimeErrMessage = '';
  addTimeLoading = false;
  addTimeIndex = {
    dayIndex: 0,
    placeIndex: 0,
  };
  timeArray = [
    '12:00 AM',
    '12:30 AM',
    '1:00 AM',
    '1:30 AM',
    '2:00 AM',
    '2:30 AM',
    '3:00 AM',
    '3:30 AM',
    '4:00 AM',
    '4:30 AM',
    '5:00 AM',
    '5:30 AM',
    '6:00 AM',
    '6:30 AM',
    '7:00 AM',
    '7:30 AM',
    '8:00 AM',
    '8:30 AM',
    '9:00 AM',
    '9:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
    '4:30 PM',
    '5:00 PM',
    '5:30 PM',
    '6:00 PM',
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
    '9:30 PM',
    '10:00 PM',
    '10:30 PM',
    '11:00 PM',
    '11:30 PM',
  ];

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
    setTimeout(() => {
      this.showResultsIndex = index;
      this.showResults = true;
    }, 200);
  }

  blurResults() {
    setTimeout(() => {
      this.inputControl.setValue('');
      this.showResults = false;
    }, 100);
  }
  selectPlace(
    selectedPlace: MapboxPlaceFeature,
    dayId: string,
    dayIndex: number,
  ) {
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

  updatePlaceDescription(
    oldValue: string,
    newValue: string,
    dayIndex: number,
    placeIndex: number,
  ) {
    if (newValue !== oldValue) {
      this.descriptionSaving = { value: true, dayIndex, placeIndex };
      this.itineraryManagementService
        .updatePlaceDescription(this.trip?._id!, dayIndex, placeIndex, {
          description: newValue,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateItineraryPlace({
                dayIndex,
                placeIndex,
                place: res.place,
              }),
            );
            this.descriptionSaving = { value: false, dayIndex, placeIndex };
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.descriptionSaving = { value: false, dayIndex, placeIndex };
          },
        });
    }
  }
  updatePlaceNotes(
    oldValue: string,
    newValue: string,
    dayIndex: number,
    placeIndex: number,
  ) {
    if (newValue !== oldValue) {
      this.notesSaving = { value: true, dayIndex, placeIndex };
      this.itineraryManagementService
        .updatePlaceNotes(this.trip?._id!, dayIndex, placeIndex, {
          notes: newValue,
        })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res) => {
            this.store.dispatch(
              tripEditActions.updateItineraryPlace({
                dayIndex,
                placeIndex,
                place: res.place,
              }),
            );
            this.notesSaving = { value: false, dayIndex, placeIndex };
          },
          error: (errMessage) => {
            console.log(errMessage);
            this.notesSaving = { value: false, dayIndex, placeIndex };
          },
        });
    }
  }
  onFileSelected(event: any, dayIndex: number, placeIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        this.changeImage(base64String, dayIndex, placeIndex);
      };
      reader.readAsDataURL(file);
    }
  }

  changeImage(
    base64String: string,
    dayIndex: number,
    placeIndex: number,
  ): void {
    this.changeImageLoading = { value: true, dayIndex, placeIndex };
    this.itineraryManagementService
      .updatePlaceImage(this.trip?._id!, dayIndex, placeIndex, {
        image: base64String,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.store.dispatch(
            tripEditActions.updateItineraryPlace({
              dayIndex,
              placeIndex,
              place: res.place,
            }),
          );
          this.changeImageLoading = { value: false, dayIndex, placeIndex };
        },
        error: (errMessage: string) => {
          this.changeImageLoading = { value: false, dayIndex, placeIndex };
        },
      });
  }

  showDeletePlace(dayIndex: number, placeIndex: number) {
    this.deletePlaceIndex = {
      dayIndex: dayIndex,
      placeIndex: placeIndex,
    };
    const deletePlaceModal = document.getElementById(
      'deletePlaceModal',
    ) as HTMLDialogElement;
    deletePlaceModal.showModal();
  }
  deletePlace() {
    this.deletePlaceLoading = true;
    const dayIndex = this.deletePlaceIndex.dayIndex;
    const placeIndex = this.deletePlaceIndex.placeIndex;
    this.itineraryManagementService
      .deletePlace(this.trip?._id!, dayIndex, placeIndex)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.deleteItineraryPlace({ dayIndex, placeIndex }),
          );
          this.deletePlaceLoading = false;
          this.closeDeletePlace();
        },
        error: (errMessage) => {
          console.log(errMessage);
          this.deletePlaceLoading = false;
          this.closeDeletePlace();
        },
      });
  }
  closeDeletePlace() {
    const deletePlaceModal = document.getElementById(
      'deletePlaceModal',
    ) as HTMLDialogElement;
    deletePlaceModal.close();
  }
  submitAddTimeForm() {
    const dayIndex = this.addTimeIndex.dayIndex;
    const placeIndex = this.addTimeIndex.placeIndex;
    const startTime = this.addTimeForm.value.startTime;
    const endTime = this.addTimeForm.value.endTime;

    if (startTime === 'start time') {
      this.addTimeErrMessage = 'start time is required';
      return;
    }
    if (endTime === 'end time') {
      this.addTimeErrMessage = 'end time is required';
      return;
    }
    const startIndex = this.timeArray.indexOf(startTime);
    const endIndex = this.timeArray.indexOf(endTime);
    // Compare the start time and end time
    if (startIndex >= endIndex) {
      this.addTimeErrMessage = 'start time must be before end time';
      return;
    }
    this.addTimeLoading = true;
    this.itineraryManagementService
      .updatePlaceTime(this.trip?._id!, dayIndex, placeIndex, {
        time: this.addTimeForm.value,
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.store.dispatch(
            tripEditActions.updateItineraryPlace({
              dayIndex,
              placeIndex,
              place: res.place,
            }),
          );
          this.addTimeLoading = false;
          this.addTimeErrMessage = '';
          this.closeAddTimeModal();
        },
        error: (errMessage) => {
          this.addTimeErrMessage = errMessage;
          this.addTimeLoading = false;
        },
      });
  }
  showAddTimeModal(dayIndex: number, placeIndex: number) {
    this.addTimeIndex = {
      dayIndex,
      placeIndex,
    };
    this.addTimeErrMessage = '';
    this.addTimeForm.reset({
      startTime: 'start time',
      endTime: 'end time',
    });
    const addTimeModal = document.getElementById(
      'addTimeModal',
    ) as HTMLDialogElement;
    addTimeModal.showModal();
  }
  closeAddTimeModal() {
    const addTimeModal = document.getElementById(
      'addTimeModal',
    ) as HTMLDialogElement;
    addTimeModal.close();
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
