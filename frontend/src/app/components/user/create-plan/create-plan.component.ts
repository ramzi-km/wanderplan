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
  MatDatepickerInput,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import {
  Observable,
  Subject,
  Subscription,
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  mergeMap,
  of,
  switchMap,
  take,
  takeUntil,
} from 'rxjs';
import { MapboxService } from 'src/app/services/mapbox/mapbox.service';
import { TripService } from 'src/app/services/trip/trip.service';
import { UnsplashService } from 'src/app/services/unsplash/unsplash.service';
import { WikipediaService } from 'src/app/services/wikepedia/wikipedia.service';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.scss'],
})
export class CreatePlanComponent implements OnInit, OnDestroy {
  showResults: boolean = false;
  inputControl = new FormControl();
  currentDate = new Date();
  createPlanForm: any;
  showErrors: boolean = false;
  places: Array<any> = [];
  searchInput = '';
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
    private wikiService: WikipediaService,
    private unsplashService: UnsplashService,
    private tripService: TripService,
    private router: Router,
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
      .subscribe((response: any) => {
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
    this.searchInput = selectedPlace.text;
    const place = {
      name: selectedPlace.text,
      coordinates: selectedPlace.center,
      extendedName: selectedPlace.place_name,
      description: '',
    };
    this.createPlanForm.patchValue({
      place: place,
    });
  }

  submitForm() {
    if (this.createPlanForm.invalid) {
      this.showErrors = true;
    } else {
      const placeName = this.createPlanForm.value.place.name;

      const updateDescription$ = this.updatePlaceDescription(placeName);
      const fetchPhotoUrl$ = this.fetchPlacePhotoUrl(placeName);

      forkJoin([updateDescription$, fetchPhotoUrl$])
        .pipe(
          take(1), // Take only one emission
          takeUntil(this.unsubscribe$),
        )
        .subscribe(([descriptionResponse, photoUrlResponse]: any) => {
          // Here you can access the updated description and photo URL
          const updatedDescription =
            descriptionResponse?.query?.pages[0]?.extract;
          const updatedPhotoUrl = photoUrlResponse?.results[0]?.urls?.regular;

          // Update the form values with the new description and photo URL
          this.createPlanForm.patchValue({
            place: {
              ...this.createPlanForm.value.place,
              description: updatedDescription,
              photoUrl: updatedPhotoUrl,
            },
          });

          // after the form is updated sent to the server

          const form = this.createPlanForm.value;
          this.tripService.createTrip(form).subscribe({
            next: (response: any) => {
              console.log(response.tripId);
              this.router.navigate(['/home']);
            },
            error: (error: any) => {
              console.log(error.error.message);
            },
          });
        });
    }
  }
  fetchPlacePhotoUrl(placeName: string) {
    return this.unsplashService.getPlacePhotoUrl(placeName).pipe(
      takeUntil(this.unsubscribe$),
      catchError((error: any) => {
        console.log(error.error);
        return of(null); // Return a default value to continue the flow
      }),
    );
  }
  updatePlaceDescription(placeName: string) {
    return this.wikiService.getLocationPage(placeName).pipe(
      switchMap((locationResponse: any) => {
        const pageId = locationResponse.query.search[0].pageid;
        return this.wikiService.getExtract(pageId);
      }),
      takeUntil(this.unsubscribe$),
      catchError((error: any) => {
        console.log(error.error);
        return of(null); // Return a default value to continue the flow
      }),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
