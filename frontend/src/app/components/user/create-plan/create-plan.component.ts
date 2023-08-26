import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs';
import {
  MapboxGeocodingResponse,
  MapboxPlaceFeature,
} from 'src/app/interfaces/mapbox-interface';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';
import { TripService } from 'src/app/services/trip/trip.service';
import * as tripEditActions from '../../../store/editingTrip/trip-edit.actions';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})
export class CreatePlanComponent implements OnInit, OnDestroy {
  loading = false;
  showResults: boolean = false;
  inputControl = new FormControl();
  currentDate = new Date();
  createPlanForm: any;
  showErrors: boolean = false;
  places: Array<MapboxPlaceFeature> = [];
  private unsubscribe$ = new Subject<void>();
  @ViewChild('picker') picker!: MatDatepicker<any>;
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.hostElement.nativeElement.contains(event.target)) {
      this.showResults = false;
    }
  }
  constructor(
    private hostElement: ElementRef,
    fb: FormBuilder,
    private mapboxService: MapboxService,
    private tripService: TripService,
    private router: Router,
    private store: Store,
  ) {
    this.createPlanForm = fb.group({
      place: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      visibility: ['private', [Validators.required]],
    });

    this.inputControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((location: string) => {
          // Cancel previous request and start a new one
          return this.mapboxService.getLocationData(location);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((response) => {
        this.places = response.features;
      });
  }
  ngOnInit(): void {}
  get fc() {
    return this.createPlanForm.controls;
  }
  openDatePicker() {
    this.picker.open();
  }

  startChange(event: MatDatepickerInputEvent<Date>) {
    this.createPlanForm.patchValue({
      startDate: event.value,
    });
  }
  endChange(event: MatDatepickerInputEvent<Date>) {
    this.createPlanForm.patchValue({
      endDate: event.value,
    });
  }
  blurResults() {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }
  selectPlace(selectedPlace: any) {
    this.inputControl.setValue(selectedPlace.text);
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
    };
    this.createPlanForm.patchValue({
      place: place,
    });
  }

  submitForm() {
    if (this.createPlanForm.invalid) {
      this.showErrors = true;
    } else {
      this.loading = true;
      const form = this.createPlanForm.value;
      this.tripService.createTrip(form).subscribe({
        next: (response) => {
          const trip = response.trip;
          this.store.dispatch(tripEditActions.setTripEdit({ trip: trip }));
          this.loading = false;
          this.router.navigate(['trip/edit', trip._id]);
        },
        error: (errMessage) => {
          console.log(errMessage);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
